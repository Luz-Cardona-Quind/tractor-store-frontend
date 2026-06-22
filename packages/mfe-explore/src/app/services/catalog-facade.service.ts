import { Injectable, inject } from '@angular/core';
import type { FilterState } from 'shared-catalog';
import { CatalogSelectors } from '../store/catalog.selectors';
import { CatalogActions } from '../store/catalog.actions';

/**
 * Punto de entrada único para los componentes de mfe-explore.
 * Los componentes solo inyectan esta facade, nunca el store directamente.
 */
@Injectable()
export class CatalogFacadeService {
  private readonly selectors = inject(CatalogSelectors);
  private readonly actions = inject(CatalogActions);

  // ── Home ────────────────────────────────────────────────────────────────────

  /** Categorías disponibles. */
  readonly categories = this.selectors.categories;

  /** Productos recomendados. */
  readonly recommendations = this.selectors.recommendations;

  // ── Category page ───────────────────────────────────────────────────────────

  /** Categoría actualmente cargada. */
  readonly activeCategory = this.selectors.activeCategory;

  /** Productos de la categoría tras aplicar filtros. */
  readonly filteredProducts = this.selectors.filteredProducts;

  /** Filtros activos del usuario. */
  readonly activeFilters = this.selectors.activeFilters;

  /** Número de filtros activos. */
  readonly activeFilterCount = this.selectors.activeFilterCount;

  /** Indica si la categoría solicitada no fue encontrada. */
  readonly notFound = this.selectors.notFound;

  // ── UI ──────────────────────────────────────────────────────────────────────

  /** Indica si hay una carga en progreso. */
  readonly isLoading = this.selectors.isLoading;

  /** Mensaje de error accionable, o null. */
  readonly error = this.selectors.error;

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Inicia la carga de datos de la home page. */
  loadHome(): void {
    this.actions.loadHome();
  }

  /**
   * Carga los productos de una categoría.
   * @param slug Slug de la categoría a cargar.
   */
  loadCategory(slug: string): void {
    this.actions.loadCategory(slug);
  }

  /**
   * Aplica un filtro parcial.
   * @param filter Campos del filtro a actualizar.
   */
  applyFilter(filter: FilterState): void {
    this.actions.applyFilter(filter);
  }

  /** Elimina todos los filtros activos. */
  clearFilters(): void {
    this.actions.clearFilters();
  }
}
