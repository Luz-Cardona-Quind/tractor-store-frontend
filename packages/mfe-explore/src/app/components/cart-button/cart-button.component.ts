import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { CART_EVENTS } from 'shared-catalog';
import type { CartUpdatedEvent, LineItem } from 'shared-catalog';

@Component({
  selector: 'explore-cart-button',
  standalone: true,
  templateUrl: './cart-button.component.html',
  styleUrl: './cart-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartButtonComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly cartItems = signal<LineItem[]>([]);

  protected readonly totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0),
  );

  protected readonly badgeLabel = computed(() =>
    this.totalItems() > 99 ? '99+' : String(this.totalItems()),
  );

  constructor() {
    fromEvent<CartUpdatedEvent>(document, CART_EVENTS.UPDATED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.cartItems.set(event.detail.items);
      });
  }

  protected goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
