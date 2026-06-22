import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'explore-category',
  template: `
    <section>
      <h1>Categoría: {{ slug() }}</h1>
      <p>Listado de productos por categoría — implementación en US-023.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  private readonly route = inject(ActivatedRoute);
  protected slug = () => this.route.snapshot.paramMap.get('slug') ?? '';
}
