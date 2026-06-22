import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'shell-not-found',
  imports: [RouterLink],
  template: `
    <section>
      <h1>404 — Página no encontrada</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <a routerLink="/">Volver al inicio</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
