import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

/**
 * Registra cada request HTTP saliente y el código de respuesta exitoso.
 * Debe ir antes de errorInterceptor en withInterceptors para capturar todos los requests.
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logging = inject(LoggingService);
  logging.log(`→ ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          logging.log(`← ${req.method} ${req.url} ${event.status}`);
        }
      },
    }),
  );
};
