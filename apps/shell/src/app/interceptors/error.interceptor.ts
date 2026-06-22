import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppError, Result } from 'shared-catalog';
import { LoggingService } from '../services/logging.service';

const CLIENT_ERROR_MESSAGES: Partial<Record<number, string>> = {
  400: 'La solicitud no es válida.',
  401: 'No tienes permiso para acceder a este recurso.',
  403: 'El acceso a este recurso está prohibido.',
  404: 'El recurso solicitado no existe.',
  408: 'La solicitud tardó demasiado. Intenta de nuevo.',
  409: 'Hubo un conflicto con la operación solicitada.',
  422: 'Los datos enviados no son válidos.',
  429: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.',
};

function toAppError(error: HttpErrorResponse): AppError {
  if (error.status >= 500) {
    return {
      message: 'Hubo un problema. Por favor, inténtalo de nuevo.',
      statusCode: error.status,
    };
  }
  return {
    message: CLIENT_ERROR_MESSAGES[error.status] ?? 'Se produjo un error inesperado.',
    statusCode: error.status,
  };
}

/**
 * Captura errores HTTP y los transforma en Result<never, AppError> antes de
 * propagarlos a los servicios. Los errores no-HTTP se relanzan sin modificar.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logging = inject(LoggingService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }
      const appError = toAppError(error);
      logging.error(`← ${req.method} ${req.url} ${error.status}`, error);
      const result: Result<never, AppError> = { ok: false, error: appError };
      return throwError(() => result);
    }),
  );
};
