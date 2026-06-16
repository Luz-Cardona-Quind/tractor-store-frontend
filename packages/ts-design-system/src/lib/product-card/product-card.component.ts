import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import type { ProductSummary } from 'shared-catalog';

@Component({
  selector: 'ts-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TsProductCardComponent {
  @Input() product!: ProductSummary;
  @Input() showPrice = true;
  @Input() loading = false;

  @Output() productSelected = new EventEmitter<string>();

  get imageUrl(): string {
    return this.product?.images?.[0] ?? '';
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3C/svg%3E';
  }

  handleClick(): void {
    if (!this.loading) {
      this.productSelected.emit(this.product.id);
    }
  }
}
