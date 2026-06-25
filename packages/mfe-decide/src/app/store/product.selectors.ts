import { Injectable, computed, inject } from '@angular/core';
import type { Variant } from 'shared-catalog';
import { ProductStore } from './product.store';

/** Valores derivados del ProductStore mediante computed(). Solo lectura. */
@Injectable({ providedIn: 'root' })
export class ProductSelectors {
  private readonly store = inject(ProductStore);

  /** Producto actualmente cargado, o null. */
  readonly product = computed(() => this.store.snapshot().product);

  /** SKU de la variante seleccionada, o null. */
  readonly selectedSku = computed(() => this.store.snapshot().selectedSku);

  /** Variante activa derivada de product + selectedSku. */
  readonly selectedVariant = computed((): Variant | null => {
    const { product, selectedSku } = this.store.snapshot();
    if (!product) return null;
    return product.variants.find((v) => v.sku === selectedSku) ?? null;
  });

  /** true cuando la variante seleccionada no tiene stock. */
  readonly isOutOfStock = computed(() => {
    const variant = this.selectedVariant();
    return variant !== null && variant.stock === 0;
  });

  /** true cuando hay variante seleccionada con stock disponible. */
  readonly canAddToCart = computed(() => {
    const variant = this.selectedVariant();
    return variant !== null && variant.stock > 0;
  });

  /** Indica si hay una carga de datos en progreso. */
  readonly isLoading = computed(() => this.store.snapshot().loading);

  /** Mensaje de error accionable, o null si no hay error. */
  readonly error = computed(() => this.store.snapshot().error);
}
