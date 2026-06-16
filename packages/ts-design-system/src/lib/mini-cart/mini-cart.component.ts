import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import type { LineItem } from 'shared-catalog';
import { TsButtonComponent } from '../button/button.component';

@Component({
  selector: 'ts-mini-cart',
  standalone: true,
  imports: [CurrencyPipe, TsButtonComponent],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TsMiniCartComponent {
  @Input() items: LineItem[] = [];
  @Input() total = 0;

  @Output() checkoutRequested = new EventEmitter<void>();
  @Output() itemRemoved = new EventEmitter<string>();

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  handleCheckout(): void {
    this.checkoutRequested.emit();
  }

  handleRemoveItem(sku: string): void {
    this.itemRemoved.emit(sku);
  }
}
