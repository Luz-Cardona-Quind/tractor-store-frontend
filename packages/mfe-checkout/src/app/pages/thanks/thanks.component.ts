import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'checkout-thanks',
  template: `
    <section>
      <h1>¡Gracias por tu compra!</h1>
      <p>Confirmación del pedido — implementación en US-036.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksComponent {}
