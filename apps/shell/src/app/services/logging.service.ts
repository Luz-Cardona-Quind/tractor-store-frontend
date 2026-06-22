import { Injectable } from '@angular/core';

/**
 * Servicio centralizado de logging del shell.
 * Reemplazar la implementación por un proveedor de observabilidad
 * (Datadog, Sentry, etc.) sin cambiar la interfaz pública.
 */
@Injectable({ providedIn: 'root' })
export class LoggingService {
  /** Registra un error inesperado con su causa. */
  error(message: string, cause?: unknown): void {
    console.error(`[Shell] ${message}`, cause ?? '');
  }

  /** Registra información de flujo normal (requests HTTP, inicialización). */
  log(message: string, context?: unknown): void {
    console.info(`[Shell] ${message}`, context ?? '');
  }

  /** Registra una advertencia o estado anómalo no crítico. */
  warn(message: string, context?: unknown): void {
    console.warn(`[Shell] ${message}`, context ?? '');
  }
}
