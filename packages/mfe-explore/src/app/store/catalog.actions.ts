import { Injectable, inject } from '@angular/core';
import { CatalogStore } from './catalog.store';
import { CatalogService } from '../services/catalog.service';

/**
 * Funciones que mutan el CatalogStore.
 * Es el único punto autorizado para llamar a store.update().
 */
@Injectable()
export class CatalogActions {
  private readonly store = inject(CatalogStore);
  private readonly service = inject(CatalogService);

  /**
   * Carga categorías, recomendaciones y tiendas desde la API.
   * Actualiza loading y error en el store según el resultado.
   */
  loadHome(): void {
    this.store.update((s) => ({ ...s, loading: true, error: null }));

    this.service.getHome().subscribe({
      next: (response) => {
        this.store.update((s) => ({
          ...s,
          categories: response.categories,
          recommendations: response.recommendations,
          stores: response.stores,
          loading: false,
        }));
      },
      error: () => {
        this.store.update((s) => ({
          ...s,
          loading: false,
          error: 'No pudimos cargar el catálogo. Intenta de nuevo.',
        }));
      },
    });
  }
}
