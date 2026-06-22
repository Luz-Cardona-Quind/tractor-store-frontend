import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EXPLORE_API_URL } from 'shared-catalog';
import type { HomeResponse } from 'shared-catalog';

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
}
