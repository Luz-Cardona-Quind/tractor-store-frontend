import { Route } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ThanksComponent } from './pages/thanks/thanks.component';

export const appRoutes: Route[] = [
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'thanks', component: ThanksComponent },
  { path: '', redirectTo: 'cart', pathMatch: 'full' },
];
