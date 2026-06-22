import { Route } from '@angular/router';
import { CartComponent } from '../pages/cart/cart.component';
import { CheckoutComponent } from '../pages/checkout/checkout.component';
import { ThanksComponent } from '../pages/thanks/thanks.component';

export const remoteRoutes: Route[] = [
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'thanks', component: ThanksComponent },
];
