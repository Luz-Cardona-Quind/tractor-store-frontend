import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'checkout-cart',
  template: `
    <section>
      <h1>Carrito</h1>
      <p>Resumen de artículos en el carrito — implementación en US-034.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {}
