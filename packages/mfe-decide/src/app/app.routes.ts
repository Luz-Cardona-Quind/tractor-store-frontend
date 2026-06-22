import { Route } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';

export const appRoutes: Route[] = [
  { path: 'product/:id', component: ProductComponent },
  { path: '', redirectTo: 'product/1', pathMatch: 'full' },
];
