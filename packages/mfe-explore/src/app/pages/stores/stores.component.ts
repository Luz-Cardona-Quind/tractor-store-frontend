import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'explore-stores',
  template: `
    <section>
      <h1>Tiendas</h1>
      <p>Listado de tiendas físicas — implementación en US-024.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresComponent {}
