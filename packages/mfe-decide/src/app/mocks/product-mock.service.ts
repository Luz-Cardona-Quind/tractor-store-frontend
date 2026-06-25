import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type { ProductResponse } from 'shared-catalog';
import { getMockProduct } from './product-mock.data';

const DELAY_MS = 300;

/**
 * Implementación de desarrollo de ProductService que devuelve datos en memoria.
 * Se activa cuando environment.useMocks === true.
 * No requiere HttpClient ni DECIDE_API_URL.
 */
@Injectable()
export class ProductMockService {
  /**
   * Devuelve el detalle de un producto por su id tras un delay simulado.
   * @param id Identificador del producto.
   * @returns Observable con la respuesta tipada, o error 404 si no existe.
   */
  getProduct(id: string): Observable<ProductResponse> {
    return timer(DELAY_MS).pipe(
      switchMap(() => {
        const product = getMockProduct(id);
        return product
          ? of({ data: product })
          : throwError(() => ({ status: 404 }));
      }),
    );
  }
}
