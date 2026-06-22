import { Injectable, inject } from '@angular/core';
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

  /** Categorías disponibles. */
  readonly categories = this.selectors.categories;

  /** Productos recomendados. */
  readonly recommendations = this.selectors.recommendations;

  /** Indica si hay una carga en progreso. */
  readonly isLoading = this.selectors.isLoading;

  /** Mensaje de error accionable, o null. */
  readonly error = this.selectors.error;

  /** Inicia la carga de datos de la home page. */
  loadHome(): void {
    this.actions.loadHome();
  }
}
