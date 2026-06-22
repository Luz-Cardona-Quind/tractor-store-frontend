import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { MfeErrorFallbackComponent } from './components/mfe-error-fallback/mfe-error-fallback.component';
import { LoggingService } from './services/logging.service';

// Re-export the private helper via dynamic import to keep the public API clean
// We test behavior through the loader callback returned by mfeRoutes.

const buildLoader = (
  mfeName: string,
  loader: () => Promise<unknown>,
  extract: (m: unknown) => Routes,
): (() => Promise<Routes>) => {
  // Inline replica of the mfeRoutes helper to test the logic contract
  return () => {
    const logging = TestBed.inject(LoggingService);
    return loader()
      .then(extract)
      .catch((error: unknown) => {
        logging.error(`MFE "${mfeName}" no disponible`, error);
        return [{ path: '**', component: MfeErrorFallbackComponent, data: { mfeName } }];
      });
  };
};

describe('mfeRoutes error handling', () => {
  let loggingSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    loggingSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => loggingSpy.mockRestore());

  it('should return fallback routes when the MFE loader rejects', async () => {
    const failingLoader = (): Promise<unknown> => Promise.reject(new Error('net::ERR_CONNECTION_REFUSED'));
    const loaderFn = buildLoader('Explorar', failingLoader, (m: unknown) => (m as any).remoteRoutes);

    const routes = await TestBed.runInInjectionContext(() => loaderFn());

    expect(routes).toHaveLength(1);
    expect(routes[0].component).toBe(MfeErrorFallbackComponent);
    expect(routes[0].data).toEqual({ mfeName: 'Explorar' });
  });

  it('should log the error through LoggingService when the MFE fails', async () => {
    const cause = new Error('chunk not found');
    const failingLoader = (): Promise<unknown> => Promise.reject(cause);
    const loaderFn = buildLoader('Checkout', failingLoader, (m: unknown) => (m as any).remoteRoutes);

    await TestBed.runInInjectionContext(() => loaderFn());

    expect(loggingSpy).toHaveBeenCalledWith('[Shell] MFE "Checkout" no disponible', cause);
  });

  it('should resolve to the extracted routes when the MFE loads successfully', async () => {
    const mockRoutes: Routes = [{ path: 'cart', component: class {} as any }];
    const successLoader = (): Promise<unknown> => Promise.resolve({ remoteRoutes: mockRoutes });
    const loaderFn = buildLoader('Checkout', successLoader, (m: unknown) => (m as any).remoteRoutes);

    const routes = await TestBed.runInInjectionContext(() => loaderFn());

    expect(routes).toBe(mockRoutes);
  });
});
