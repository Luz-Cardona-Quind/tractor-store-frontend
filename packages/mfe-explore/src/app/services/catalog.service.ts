import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EXPLORE_API_URL } from 'shared-catalog';
import type { CategoryResponse, HomeResponse, RecommendationsResponse, StoresResponse } from 'shared-catalog';

/**
 * Servicio HTTP del equipo Explore.
 * Los errores se delegan al interceptor global del shell.
 */
@Injectable()
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(EXPLORE_API_URL);

  /**
   * Obtiene categorías, recomendaciones y tiendas de la home.
   * @returns Observable con la respuesta tipada del endpoint GET /home.
   */
  getHome(): Observable<HomeResponse> {
    return this.http.get<HomeResponse>(`${this.apiUrl}/home`);
  }

  /**
   * Obtiene los productos y metadatos de una categoría.
   * @param slug Identificador único de la categoría.
   * @returns Observable con la respuesta tipada del endpoint GET /category/:slug.
   */
  getCategory(slug: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/category/${slug}`);
  }

  /**
   * Obtiene el listado completo de tiendas físicas.
   * @returns Observable con el array tipado del endpoint GET /stores.
   */
  getStores(): Observable<StoresResponse> {
    return this.http.get<StoresResponse>(`${this.apiUrl}/stores`);
  }

  /**
   * Obtiene recomendaciones de productos, opcionalmente contextuales a un producto.
   * @param productId Id del producto actual para recomendaciones relacionadas.
   * @returns Observable con el array tipado del endpoint GET /recommendations.
   */
  getRecommendations(productId?: string): Observable<RecommendationsResponse> {
    const url = productId
      ? `${this.apiUrl}/recommendations?productId=${productId}`
      : `${this.apiUrl}/recommendations`;
    return this.http.get<RecommendationsResponse>(url);
  }
}
