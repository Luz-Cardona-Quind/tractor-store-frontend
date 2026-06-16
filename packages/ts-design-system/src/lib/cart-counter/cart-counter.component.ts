import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { CART_EVENTS } from 'shared-catalog';
import type { CartUpdatedEvent } from 'shared-catalog';

@Component({
  selector: 'ts-cart-counter',
  standalone: true,
  templateUrl: './cart-counter.component.html',
  styleUrl: './cart-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TsCartCounterComponent {
  protected readonly count = signal(0);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    fromEvent<CartUpdatedEvent>(document, CART_EVENTS.UPDATED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.count.set(event.detail.items.length);
      });
  }

  /** Permite establecer el conteo directamente desde el exterior (Storybook, tests, host Angular). */
  @Input() set itemCount(value: number) {
    this.count.set(value);
  }
}
