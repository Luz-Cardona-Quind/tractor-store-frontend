import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'checkout-checkout',
  template: `
    <section>
      <h1>Checkout</h1>
      <p>Formulario de datos de envío y pago — implementación en US-035.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {}
