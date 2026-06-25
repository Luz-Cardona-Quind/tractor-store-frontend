import { Injectable, inject } from '@angular/core';
import type { Product } from 'shared-catalog';
import { ProductActions } from './product.actions';
import { ProductSelectors } from './product.selectors';

/**
 * Punto de entrada único para los componentes de mfe-decide.
 * Encapsula ProductStore, ProductActions y ProductSelectors.
 */
@Injectable()
export class ProductFacadeService {
  private readonly actions = inject(ProductActions);
  private readonly selectors = inject(ProductSelectors);

  // ── Selectors ────────────────────────────────────────────────────────────────

  /** Producto actualmente cargado, o null. */
  readonly product = this.selectors.product;

  /** SKU de la variante activa. */
  readonly selectedSku = this.selectors.selectedSku;

  /** Variante activa derivada de product + selectedSku. */
  readonly selectedVariant = this.selectors.selectedVariant;

  /** true cuando la variante seleccionada no tiene stock. */
  readonly isOutOfStock = this.selectors.isOutOfStock;

  /** true cuando se puede añadir al carrito (variante seleccionada con stock). */
  readonly canAddToCart = this.selectors.canAddToCart;

  /** Indica si hay una carga en progreso. */
  readonly isLoading = this.selectors.isLoading;

  /** Mensaje de error, o null si no hay error. */
  readonly error = this.selectors.error;

  // ── Actions ──────────────────────────────────────────────────────────────────

  /**
   * Carga el producto desde la API.
   * @param id Identificador del producto.
   */
  loadProduct(id: string): void {
    this.actions.loadProduct(id);
  }

  /**
   * Hidrata el store con un producto precargado por el resolver.
   * @param product Producto ya resuelto.
   */
  setProduct(product: Product): void {
    this.actions.setProduct(product);
  }

  /**
   * Selecciona una variante como activa.
   * @param sku SKU de la variante seleccionada.
   */
  selectVariant(sku: string): void {
    this.actions.selectVariant(sku);
  }

  /** Limpia el estado al salir de la página de producto. */
  clearProduct(): void {
    this.actions.clearProduct();
  }
}
