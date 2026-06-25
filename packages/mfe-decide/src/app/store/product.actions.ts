import { Injectable, inject } from '@angular/core';
import type { Product } from 'shared-catalog';
import { ProductStore } from './product.store';
import { ProductService } from '../services/product.service';

/**
 * Funciones que mutan el ProductStore.
 * Es el único punto autorizado para llamar a store.update().
 */
@Injectable()
export class ProductActions {
  private readonly store = inject(ProductStore);
  private readonly service = inject(ProductService);

  /**
   * Carga el producto desde la API y selecciona la primera variante con stock.
   * @param id Identificador del producto.
   */
  loadProduct(id: string): void {
    this.store.update((s) => ({ ...s, loading: true, error: null, product: null, selectedSku: null }));

    this.service.getProduct(id).subscribe({
      next: ({ data }) => {
        const firstInStock = data.variants.find((v) => v.stock > 0) ?? data.variants[0] ?? null;
        this.store.update((s) => ({
          ...s,
          product: data,
          selectedSku: firstInStock?.sku ?? null,
          loading: false,
        }));
      },
      error: () => {
        this.store.update((s) => ({
          ...s,
          loading: false,
          error: 'No pudimos cargar el producto. Intenta de nuevo.',
        }));
      },
    });
  }

  /**
   * Hidrata el store con un producto ya precargado (desde el resolver).
   * @param product Producto precargado por el resolver.
   */
  setProduct(product: Product): void {
    const firstInStock = product.variants.find((v) => v.stock > 0) ?? product.variants[0] ?? null;
    this.store.update((s) => ({
      ...s,
      product,
      selectedSku: firstInStock?.sku ?? null,
      loading: false,
      error: null,
    }));
  }

  /**
   * Cambia la variante seleccionada activa.
   * @param sku SKU de la variante a seleccionar.
   */
  selectVariant(sku: string): void {
    this.store.update((s) => ({ ...s, selectedSku: sku }));
  }

  /** Limpia el producto del store al salir de la página. */
  clearProduct(): void {
    this.store.update(() => ({
      product: null,
      selectedSku: null,
      loading: false,
      error: null,
    }));
  }
}
