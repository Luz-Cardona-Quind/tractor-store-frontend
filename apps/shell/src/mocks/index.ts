import { setupWorker } from 'msw/browser';
import { exploreHandlers } from './explore-api.handlers';

/**
 * Service Worker de MSW que intercepta todas las llamadas HTTP en desarrollo.
 * Usar solo cuando la variable de entorno `useMocks` esté activa.
 */
export const worker = setupWorker(...exploreHandlers);
