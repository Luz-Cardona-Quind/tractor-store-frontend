import { Injectable, signal } from '@angular/core';
import type { Product } from 'shared-catalog';

export interface ProductState {
  product: Product | null;
  selectedSku: string | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: ProductState = {
  product: null,
  selectedSku: null,
  loading: false,
  error: null,
};

/**
 * Fuente única de verdad del producto activo para mfe-decide.
 * Solo ProductActions debe llamar a update().
 */
@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly state = signal<ProductState>(INITIAL_STATE);

  readonly snapshot = this.state.asReadonly();

  /**
   * Aplica una transformación inmutable al estado.
   * @param updater Función pura que devuelve el nuevo estado.
   */
  update(updater: (current: ProductState) => ProductState): void {
    this.state.update(updater);
  }
}
