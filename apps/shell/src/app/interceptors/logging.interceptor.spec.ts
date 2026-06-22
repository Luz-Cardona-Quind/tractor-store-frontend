import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { loggingInterceptor } from './logging.interceptor';
import { LoggingService } from '../services/logging.service';

describe('loggingInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loggingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    logSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    httpTesting.verify();
    logSpy.mockRestore();
  });

  it('should log the outgoing request method and URL', () => {
    http.get('/api/products').subscribe();
    httpTesting.expectOne('/api/products').flush([]);

    const outgoing = logSpy.mock.calls.find((c) => (c[0] as string).includes('→'));
    expect(outgoing).toBeDefined();
    expect(outgoing![0]).toContain('GET');
    expect(outgoing![0]).toContain('/api/products');
  });

  it('should log the response status code on success', () => {
    http.get('/api/products').subscribe();
    httpTesting.expectOne('/api/products').flush([], { status: 200, statusText: 'OK' });

    const incoming = logSpy.mock.calls.find((c) => (c[0] as string).includes('←'));
    expect(incoming).toBeDefined();
    expect(incoming![0]).toContain('200');
    expect(incoming![0]).toContain('/api/products');
  });

  it('should log exactly two messages per successful request (out + in)', () => {
    http.get('/api/items').subscribe();
    httpTesting.expectOne('/api/items').flush({});
    expect(logSpy).toHaveBeenCalledTimes(2);
  });

  it('should log only the outgoing message when the request fails', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    http.get('/api/missing').subscribe({ error: () => {} });
    httpTesting
      .expectOne('/api/missing')
      .flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect((logSpy.mock.calls[0][0] as string)).toContain('→');
    errSpy.mockRestore();
  });

  it('should use LoggingService for logging (not console.log directly)', () => {
    const logging = TestBed.inject(LoggingService);
    const serviceSpy = jest.spyOn(logging, 'log');

    http.get('/api/test').subscribe();
    httpTesting.expectOne('/api/test').flush({});

    expect(serviceSpy).toHaveBeenCalledTimes(2);
  });
});
