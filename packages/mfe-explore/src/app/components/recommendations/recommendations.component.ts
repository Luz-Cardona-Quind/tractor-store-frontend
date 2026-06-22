import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TsProductCardComponent } from 'ts-design-system';
import type { ProductSummary } from 'shared-catalog';

const SKELETON_COUNT = 4;

@Component({
  selector: 'explore-recommendations',
  standalone: true,
  imports: [TsProductCardComponent],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationsComponent {
  @Input() products: ProductSummary[] = [];
  @Input() loading = false;

  /** Emite el id del producto seleccionado. */
  @Output() productSelected = new EventEmitter<string>();

  protected readonly skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

  protected readonly placeholder: ProductSummary = {
    id: '',
    name: '',
    category: '',
    price: 0,
    images: [],
  };

  protected get showSkeletons(): boolean {
    return this.loading && this.products.length === 0;
  }
}
