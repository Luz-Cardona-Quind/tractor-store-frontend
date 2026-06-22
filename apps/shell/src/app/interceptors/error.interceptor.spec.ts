import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { throwError } from 'rxjs';
import { AppError, Result } from 'shared-catalog';
import { errorInterceptor } from './error.interceptor';
import { LoggingService } from '../services/logging.service';

const flushError = (
  controller: HttpTestingController,
  url: string,
  status: number,
  statusText: string,
): void => {
  controller.expectOne(url).flush('', { status, statusText });
};

describe('errorInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;
  let errSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpTesting.verify();
    errSpy.mockRestore();
  });

  it('should transform a 404 into Result<never, AppError> with correct message', (done) => {
    http.get('/api/item/99').subscribe({
      error: (result: Result<never, AppError>) => {
        expect(result.ok).toBe(false);
        expect(result.error.message).toBe('El recurso solicitado no existe.');
        expect(result.error.statusCode).toBe(404);
        done();
      },
    });
    flushError(httpTesting, '/api/item/99', 404, 'Not Found');
  });

  it('should transform a 400 into Result with "solicitud no válida" message', (done) => {
    http.post('/api/order', {}).subscribe({
      error: (result: Result<never, AppError>) => {
        expect(result.ok).toBe(false);
        expect(result.error.message).toBe('La solicitud no es válida.');
        expect(result.error.statusCode).toBe(400);
        done();
      },
    });
    httpTesting.expectOne('/api/order').flush('', { status: 400, statusText: 'Bad Request' });
  });

  it('should transform a 401 into Result with "permiso" message', (done) => {
    http.get('/api/protected').subscribe({
      error: (result: Result<never, AppError>) => {
        expect(result.ok).toBe(false);
        expect(result.error.message).toBe('No tienes permiso para acceder a este recurso.');
        done();
      },
    });
    flushError(httpTesting, '/api/protected', 401, 'Unauthorized');
  });

  it('should transform a 403 into Result with "acceso prohibido" message', (done) => {
    http.get('/api/admin').subscribe({
      error: (result: Result<never, AppError>) => {
        expect(result.ok).toBe(false);
        expect(result.error.message).toBe('El acceso a este recurso está prohibido.');
        done();
      },
    });
    flushError(httpTesting, '/api/admin', 403, 'Forbidden');
  });

  it('should map all 5xx errors to the generic server error message', (done) => {
    http.get('/api/crash').subscribe({
      error: (result: Result<never, AppError>) => {
        expect(result.ok).toBe(false);
        expect(result.error.message).toBe(
          'Hubo un problema. Por favor, inténtalo de nuevo.',
        );
        expect(result.error.statusCode).toBe(500);
        done();
      },
    });
    flushError(httpTesting, '/api/crash', 500, 'Internal Server Error');
  });

  it('should use generic message for unknown 4xx status codes', (done) => {
    http.get('/api/teapot').subscribe({
      error: (result: Result<never, AppError>) => {
        expect(result.ok).toBe(false);
        expect(result.error.message).toBe('Se produjo un error inesperado.');
        expect(result.error.statusCode).toBe(418);
        done();
      },
    });
    flushError(httpTesting, '/api/teapot', 418, "I'm a teapot");
  });

  it('should log the error via LoggingService with method, URL and status', (done) => {
    const logging = TestBed.inject(LoggingService);
    const loggingSpy = jest.spyOn(logging, 'error');

    http.get('/api/missing').subscribe({
      error: () => {
        expect(loggingSpy).toHaveBeenCalledTimes(1);
        const [msg] = loggingSpy.mock.calls[0];
        expect(msg).toContain('GET');
        expect(msg).toContain('/api/missing');
        expect(msg).toContain('404');
        done();
      },
    });
    flushError(httpTesting, '/api/missing', 404, 'Not Found');
  });

  it('should pass through non-HTTP errors unchanged', (done) => {
    // HttpTestingController siempre envuelve los errores en HttpErrorResponse.
    // Para testear el caso de error no-HTTP (ej: excepción de otro interceptor),
    // llamamos al interceptor directamente con un next mock que lanza un Error plano.
    const plainError = new Error('programming error');
    const req = new HttpRequest('GET', '/api/test');

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, () => throwError(() => plainError)).subscribe({
        error: (err: unknown) => {
          expect(err).toBe(plainError);
          done();
        },
      });
    });
  });
});
