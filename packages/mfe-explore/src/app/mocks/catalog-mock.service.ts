import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type { CategoryResponse, HomeResponse, RecommendationsResponse, StoresResponse } from 'shared-catalog';
import {
  getMockCategoryResponse,
  getMockHomeResponse,
  getMockRecommendationsResponse,
  getMockStoresResponse,
} from './catalog-mock.data';

const DELAY_MS = 700;

/**
 * Implementación de desarrollo de CatalogService que devuelve datos en memoria.
 * Se activa cuando environment.useMocks === true.
 * No requiere HttpClient ni EXPLORE_API_URL.
 */
@Injectable()
export class CatalogMockService {
  /** @returns Observable con datos de home simulados tras un delay. */
  getHome(): Observable<HomeResponse> {
    return timer(DELAY_MS).pipe(switchMap(() => of(getMockHomeResponse())));
  }

  /**
   * @param slug Slug de la categoría a cargar.
   * @returns Observable con la categoría, o error 404 si el slug no existe.
   */
  getCategory(slug: string): Observable<CategoryResponse> {
    return timer(DELAY_MS).pipe(
      switchMap(() => {
        const data = getMockCategoryResponse(slug);
        // Lanza { status: 404 } para que isNotFoundError() lo reconozca (rama standalone)
        return data ? of(data) : throwError(() => ({ status: 404 }));
      }),
    );
  }

  /** @returns Observable con el listado completo de tiendas físicas simuladas. */
  getStores(): Observable<StoresResponse> {
    return timer(DELAY_MS).pipe(switchMap(() => of(getMockStoresResponse())));
  }

  /**
   * @param productId Id del producto actual para excluirlo de las recomendaciones.
   * @returns Observable con el array de productos recomendados simulados.
   */
  getRecommendations(productId?: string): Observable<RecommendationsResponse> {
    return timer(DELAY_MS).pipe(
      switchMap(() => of(getMockRecommendationsResponse(productId))),
    );
  }
}
