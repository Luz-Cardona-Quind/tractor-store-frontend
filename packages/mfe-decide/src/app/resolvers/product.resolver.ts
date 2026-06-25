import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Product } from 'shared-catalog';
import { ProductService } from '../services/product.service';

/**
 * Precarga el producto antes de activar /product/:id.
 * Si el producto no existe (404 o error de red), redirige a / sin flash de contenido vacío.
 */
export const productResolver: ResolveFn<Product> = (route) => {
  const router = inject(Router);
  const service = inject(ProductService);
  const id = route.paramMap.get('id') ?? '';

  return service.getProduct(id).pipe(
    map((response) => response.data),
    catchError(() => {
      router.navigate(['/']);
      return EMPTY;
    }),
  );
};
