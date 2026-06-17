import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'mfe-explore',
    loadChildren: () =>
      import('mfe-explore/Routes').then((m) => (m as { remoteRoutes: Route[] }).remoteRoutes),
  },
  {
    path: 'mfe-decide',
    loadChildren: () =>
      import('mfe-decide/Routes').then((m) => (m as { remoteRoutes: Route[] }).remoteRoutes),
  },
  {
    path: 'mfe-checkout',
    loadChildren: () =>
      import('mfe-checkout/Routes').then((m) => (m as { remoteRoutes: Route[] }).remoteRoutes),
  },
  {
    path: '',
    component: NxWelcome,
  },
];
