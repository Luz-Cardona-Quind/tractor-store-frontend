import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CART_EVENTS } from 'shared-catalog';
import type { LineItem, Product } from 'shared-catalog';
import { TsButtonComponent, TsVariantOptionComponent } from 'ts-design-system';
import { ProductFacadeService } from '../../store/product.facade';

@Component({
  standalone: true,
  selector: 'decide-product',
  imports: [CurrencyPipe, TsButtonComponent, TsVariantOptionComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent implements OnInit, OnDestroy {
  @ViewChild('recommendationsSlot', { read: ViewContainerRef })
  private readonly recommendationsSlot?: ViewContainerRef;

  protected readonly facade = inject(ProductFacadeService);
  private readonly route = inject(ActivatedRoute);

  protected readonly activeImageIndex = signal(0);

  ngOnInit(): void {
    const product = this.route.snapshot.data['product'] as Product | undefined;
    if (product) {
      this.facade.setProduct(product);
    } else {
      this.facade.loadProduct(this.route.snapshot.paramMap.get('id') ?? '');
    }
    this.loadRecommendations();
  }

  ngOnDestroy(): void {
    this.facade.clearProduct();
  }

  protected activeImage(): string {
    const images = this.facade.product()?.images ?? [];
    return images[this.activeImageIndex()] ?? '';
  }

  protected setActiveImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  protected onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3C/svg%3E';
  }

  protected onVariantSelected(sku: string): void {
    this.facade.selectVariant(sku);
  }

  protected addToCart(): void {
    const product = this.facade.product();
    const variant = this.facade.selectedVariant();
    if (!product || !variant) return;

    const lineItem: LineItem = {
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      price: variant.price,
      quantity: 1,
      productId: product.id,
      productName: product.name,
    };

    document.dispatchEvent(
      new CustomEvent(CART_EVENTS.ITEM_ADDED, {
        detail: { item: lineItem },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected retry(): void {
    this.facade.loadProduct(this.route.snapshot.paramMap.get('id') ?? '');
  }

  private loadRecommendations(): void {
    const productId = this.route.snapshot.paramMap.get('id') ?? undefined;

    // Carga RecommendationsComponent de mfe-explore vía Module Federation.
    // El import dinámico falla silenciosamente si mfe-explore no está levantado.
    import('mfe-explore/Recommendations')
      .then((m) => {
        if (!this.recommendationsSlot) return;
        const ref = this.recommendationsSlot.createComponent(m.RecommendationsComponent);
        ref.setInput('productId', productId);
      })
      .catch(() => {
        // mfe-explore no disponible: el slot queda vacío sin crashear
      });
  }
}
