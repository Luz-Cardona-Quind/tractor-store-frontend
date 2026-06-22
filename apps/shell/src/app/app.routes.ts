import { Route } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('mfe-explore/Routes').then((m) => (m as { remoteRoutes: Route[] }).remoteRoutes),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('mfe-decide/Routes').then((m) => (m as { remoteRoutes: Route[] }).remoteRoutes),
  },
  {
    path: '',
    loadChildren: () =>
      import('mfe-checkout/Routes').then((m) => (m as { remoteRoutes: Route[] }).remoteRoutes),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
