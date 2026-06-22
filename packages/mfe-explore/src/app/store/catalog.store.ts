import { Injectable, signal } from '@angular/core';
import type { Category, ProductSummary, Store } from 'shared-catalog';

export interface CatalogState {
  categories: Category[];
  recommendations: ProductSummary[];
  stores: Store[];
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: CatalogState = {
  categories: [],
  recommendations: [],
  stores: [],
  loading: false,
  error: null,
};

/**
 * Fuente única de verdad del catálogo para mfe-explore.
 * Solo CatalogActions debe llamar a update().
 */
@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly state = signal<CatalogState>(INITIAL_STATE);

  readonly snapshot = this.state.asReadonly();

  /**
   * Aplica una transformación inmutable al estado.
   * @param updater Función pura que devuelve el nuevo estado.
   */
  update(updater: (current: CatalogState) => CatalogState): void {
    this.state.update(updater);
  }
}
