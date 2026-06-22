import { inject } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MfeErrorFallbackComponent } from './components/mfe-error-fallback/mfe-error-fallback.component';
import { LoggingService } from './services/logging.service';

/**
 * Envuelve la carga lazy de un MFE con manejo de error.
 * Si el remote falla (red, timeout, 404), registra el error y devuelve
 * una ruta de fallback que muestra MfeErrorFallbackComponent.
 */
function mfeRoutes(
  mfeName: string,
  loader: () => Promise<unknown>,
  extract: (m: unknown) => Routes,
): () => Promise<Routes> {
  return () => {
    const logging = inject(LoggingService);
    return loader()
      .then(extract)
      .catch((error: unknown) => {
        logging.error(`MFE "${mfeName}" no disponible`, error);
        return [{ path: '**', component: MfeErrorFallbackComponent, data: { mfeName } }];
      });
  };
}

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: mfeRoutes(
      'Explorar',
      () => import('mfe-explore/Routes'),
      (m) => (m as { remoteRoutes: Routes }).remoteRoutes,
    ),
  },
  {
    path: 'product',
    loadChildren: mfeRoutes(
      'Producto',
      () => import('mfe-decide/Routes'),
      (m) => (m as { remoteRoutes: Routes }).remoteRoutes,
    ),
  },
  {
    path: '',
    loadChildren: mfeRoutes(
      'Checkout',
      () => import('mfe-checkout/Routes'),
      (m) => (m as { remoteRoutes: Routes }).remoteRoutes,
    ),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
