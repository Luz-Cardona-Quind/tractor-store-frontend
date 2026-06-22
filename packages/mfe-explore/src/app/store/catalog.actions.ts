import { Injectable, inject } from '@angular/core';
import type { AppError, FilterState, Result } from 'shared-catalog';
import { CatalogStore } from './catalog.store';
import { CatalogService } from '../services/catalog.service';

function isNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  // Result<never, AppError> emitido por el error interceptor del shell
  const r = err as Record<string, unknown>;
  if (r['ok'] === false && r['error'] && typeof r['error'] === 'object') {
    return (r['error'] as Partial<AppError>).statusCode === 404;
  }
  // HttpErrorResponse en modo standalone (sin interceptor)
  return (r as Partial<Result<never, AppError>>).ok !== false && r['status'] === 404;
}

/**
 * Funciones que mutan el CatalogStore.
 * Es el único punto autorizado para llamar a store.update().
 */
@Injectable()
export class CatalogActions {
  private readonly store = inject(CatalogStore);
  private readonly service = inject(CatalogService);

  /** Carga categorías, recomendaciones y tiendas desde la API. */
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

  /**
   * Carga los productos de una categoría por slug.
   * Si el servidor devuelve 404, activa el flag notFound.
   * @param slug Identificador único de la categoría.
   */
  loadCategory(slug: string): void {
    this.store.update((s) => ({
      ...s,
      loading: true,
      error: null,
      notFound: false,
      activeCategory: null,
      categoryProducts: [],
    }));

    this.service.getCategory(slug).subscribe({
      next: (response) => {
        this.store.update((s) => ({
          ...s,
          activeCategory: response.category,
          categoryProducts: response.products,
          loading: false,
        }));
      },
      error: (err: unknown) => {
        const notFound = isNotFoundError(err);
        this.store.update((s) => ({
          ...s,
          loading: false,
          notFound,
          error: notFound ? null : 'No pudimos cargar la categoría. Intenta de nuevo.',
        }));
      },
    });
  }

  /**
   * Aplica un filtro parcial al estado activo.
   * @param filter Campos del filtro a actualizar.
   */
  applyFilter(filter: FilterState): void {
    this.store.update((s) => ({ ...s, activeFilters: { ...s.activeFilters, ...filter } }));
  }

  /** Elimina todos los filtros activos. */
  clearFilters(): void {
    this.store.update((s) => ({ ...s, activeFilters: {} }));
  }
}
