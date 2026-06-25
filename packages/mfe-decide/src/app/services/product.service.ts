import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DECIDE_API_URL } from 'shared-catalog';
import type { ProductResponse } from 'shared-catalog';

/**
 * Servicio HTTP del equipo Decide.
 * Los errores se delegan al interceptor global del shell.
 */
@Injectable()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(DECIDE_API_URL);

  /**
   * Obtiene el detalle completo de un producto por su id.
   * @param id Identificador del producto.
   * @returns Observable con la respuesta tipada del endpoint GET /product/:id.
   */
  getProduct(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/product/${id}`);
  }
}
