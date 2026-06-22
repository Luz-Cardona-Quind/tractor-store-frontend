import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'decide-product',
  template: `
    <section>
      <h1>Producto: {{ productId() }}</h1>
      <p>Detalle del producto con selector de variantes — implementación en US-029.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  private readonly route = inject(ActivatedRoute);
  protected productId = () => this.route.snapshot.paramMap.get('id') ?? '';
}
