import { Injectable, computed, inject } from '@angular/core';
import { CatalogStore } from './catalog.store';

/** Valores derivados del CatalogStore mediante computed(). Solo lectura. */
@Injectable({ providedIn: 'root' })
export class CatalogSelectors {
  private readonly store = inject(CatalogStore);

  // ── Home ────────────────────────────────────────────────────────────────────

  /** Listado de categorías disponibles. */
  readonly categories = computed(() => this.store.snapshot().categories);

  /** Productos recomendados para la home. */
  readonly recommendations = computed(() => this.store.snapshot().recommendations);

  /** Tiendas físicas disponibles. */
  readonly stores = computed(() => this.store.snapshot().stores);

  // ── Category page ───────────────────────────────────────────────────────────

  /** Categoría actualmente seleccionada. */
  readonly activeCategory = computed(() => this.store.snapshot().activeCategory);

  /** Filtros activos del usuario. */
  readonly activeFilters = computed(() => this.store.snapshot().activeFilters);

  /** Indica si la categoría solicitada no fue encontrada (404). */
  readonly notFound = computed(() => this.store.snapshot().notFound);

  /** Productos de la categoría activa tras aplicar los filtros. */
  readonly filteredProducts = computed(() => {
    const { categoryProducts, activeFilters } = this.store.snapshot();
    const { maxPrice } = activeFilters;
    if (maxPrice === undefined) return categoryProducts;
    return categoryProducts.filter((p) => p.price <= maxPrice);
  });

  /** Número de filtros activos distintos de undefined. */
  readonly activeFilterCount = computed(() =>
    Object.values(this.store.snapshot().activeFilters).filter(
      (v) => v !== undefined && v !== null,
    ).length,
  );

  // ── UI ──────────────────────────────────────────────────────────────────────

  /** Indica si hay una carga de datos en progreso. */
  readonly isLoading = computed(() => this.store.snapshot().loading);

  /** Mensaje de error accionable, o null si no hay error. */
  readonly error = computed(() => this.store.snapshot().error);
}
