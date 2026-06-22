import { Injectable, computed, inject } from '@angular/core';
import { CatalogStore } from './catalog.store';

/** Valores derivados del CatalogStore mediante computed(). Solo lectura. */
@Injectable({ providedIn: 'root' })
export class CatalogSelectors {
  private readonly store = inject(CatalogStore);

  /** Listado de categorías disponibles. */
  readonly categories = computed(() => this.store.snapshot().categories);

  /** Productos recomendados para la home. */
  readonly recommendations = computed(() => this.store.snapshot().recommendations);

  /** Tiendas físicas disponibles. */
  readonly stores = computed(() => this.store.snapshot().stores);

  /** Indica si hay una carga de datos en progreso. */
  readonly isLoading = computed(() => this.store.snapshot().loading);

  /** Mensaje de error accionable, o null si no hay error. */
  readonly error = computed(() => this.store.snapshot().error);
}
