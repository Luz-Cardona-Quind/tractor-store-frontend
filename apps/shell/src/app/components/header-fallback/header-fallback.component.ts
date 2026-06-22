import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shell-header-fallback',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="shell-header-fallback">
      <a routerLink="/" class="shell-header-fallback__logo" aria-label="The Tractor Store - Inicio">
        🚜 Tractor Store
      </a>
      <nav aria-label="Navegación principal">
        <a routerLink="/" class="shell-header-fallback__link">Inicio</a>
        <a routerLink="/stores" class="shell-header-fallback__link">Tiendas</a>
        <a routerLink="/cart" class="shell-header-fallback__link">Carrito</a>
      </nav>
    </header>
  `,
  styles: [`
    .shell-header-fallback {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-8);
      background: var(--color-surface);
      border-bottom: var(--border-1) solid var(--color-border);
    }
    .shell-header-fallback__logo {
      font-weight: var(--font-bold);
      font-size: var(--text-xl);
      text-decoration: none;
      color: var(--color-primary);
    }
    nav { display: flex; gap: var(--space-6); }
    .shell-header-fallback__link {
      text-decoration: none;
      color: var(--color-text);
      font-size: var(--text-sm);
      padding: var(--space-2) var(--space-4);
    }
    .shell-header-fallback__link:hover { color: var(--color-primary); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellHeaderFallbackComponent {}
