import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'explore-home',
  template: `
    <section>
      <h1>Home</h1>
      <p>Catálogo de tractores — implementación en US-022.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
