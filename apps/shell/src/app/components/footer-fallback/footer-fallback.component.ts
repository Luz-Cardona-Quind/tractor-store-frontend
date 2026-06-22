import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shell-footer-fallback',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="shell-footer-fallback">
      <nav aria-label="Navegación secundaria">
        <a routerLink="/" class="shell-footer-fallback__link">Inicio</a>
        <a routerLink="/stores" class="shell-footer-fallback__link">Tiendas</a>
        <a routerLink="/cart" class="shell-footer-fallback__link">Carrito</a>
      </nav>
      <p class="shell-footer-fallback__copy">&copy; 2026 The Tractor Store</p>
    </footer>
  `,
  styles: [`
    .shell-footer-fallback {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-6) var(--space-8);
      background: var(--color-surface);
      border-top: var(--border-1) solid var(--color-border);
      font-size: var(--text-sm);
    }
    nav { display: flex; gap: var(--space-6); }
    .shell-footer-fallback__link {
      text-decoration: none;
      color: var(--color-text);
      padding: var(--space-2) var(--space-4);
    }
    .shell-footer-fallback__link:hover { color: var(--color-primary); }
    .shell-footer-fallback__copy { color: var(--color-text-muted); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellFooterFallbackComponent {}
