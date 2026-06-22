import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type { CategoryResponse, HomeResponse } from 'shared-catalog';
import { getMockCategoryResponse, getMockHomeResponse } from './catalog-mock.data';

const DELAY_MS = 700;

/**
 * Implementación de desarrollo de CatalogService que devuelve datos en memoria.
 * Se activa cuando environment.useMocks === true.
 * No requiere HttpClient ni EXPLORE_API_URL.
 */
@Injectable()
export class CatalogMockService {
  getHome(): Observable<HomeResponse> {
    return timer(DELAY_MS).pipe(switchMap(() => of(getMockHomeResponse())));
  }

  getCategory(slug: string): Observable<CategoryResponse> {
    return timer(DELAY_MS).pipe(
      switchMap(() => {
        const data = getMockCategoryResponse(slug);
        // Lanza { status: 404 } para que isNotFoundError() lo reconozca (rama standalone)
        return data ? of(data) : throwError(() => ({ status: 404 }));
      }),
    );
  }
}
