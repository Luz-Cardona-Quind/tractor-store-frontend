import { Route } from '@angular/router';
import { ProductComponent } from '../pages/product/product.component';

export const remoteRoutes: Route[] = [
  { path: ':id', component: ProductComponent },
];
