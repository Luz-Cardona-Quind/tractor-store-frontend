import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DECIDE_API_URL } from 'shared-catalog';
import type { Product, ProductResponse } from 'shared-catalog';
import { productResolver } from './product.resolver';
import { ProductService } from '../services/product.service';

const API_URL = 'http://localhost:8080/decide/api';

const MOCK_PRODUCT: Product = {
  id: 'p-1',
  name: 'TractorMax 3000',
  category: 'campo',
  price: 85_000,
  images: ['/img/campo.svg'],
  variants: [{ sku: 'SKU-A', color: 'Verde', size: 'Grande', stock: 5, price: 85_000 }],
};

const MOCK_RESPONSE: ProductResponse = { data: MOCK_PRODUCT };

function makeRoute(id: string): ActivatedRouteSnapshot {
  const snap = new ActivatedRouteSnapshot();
  Object.defineProperty(snap, 'paramMap', {
    value: convertToParamMap({ id }),
  });
  return snap;
}

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: DECIDE_API_URL, useValue: API_URL },
      ProductService,
    ],
  });
  return {
    http: TestBed.inject(HttpTestingController),
    router: TestBed.inject(Router),
  };
}

describe('productResolver', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    TestBed.resetTestingModule();
  });

  it('should return the product on successful response', (done) => {
    const { http } = setup();
    const route = makeRoute('p-1');

    TestBed.runInInjectionContext(() =>
      productResolver(route, {} as RouterStateSnapshot),
    ).subscribe((product) => {
      expect(product.id).toBe('p-1');
      expect(product.name).toBe('TractorMax 3000');
      done();
    });

    http.expectOne(`${API_URL}/product/p-1`).flush(MOCK_RESPONSE);
  });

  it('should redirect to "/" and return EMPTY on 404', (done) => {
    const { http, router } = setup();
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const route = makeRoute('nope');

    TestBed.runInInjectionContext(() =>
      productResolver(route, {} as RouterStateSnapshot),
    ).subscribe({
      complete: () => {
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
        done();
      },
    });

    http
      .expectOne(`${API_URL}/product/nope`)
      .flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should redirect to "/" and return EMPTY on network error', (done) => {
    const { http, router } = setup();
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const route = makeRoute('p-err');

    TestBed.runInInjectionContext(() =>
      productResolver(route, {} as RouterStateSnapshot),
    ).subscribe({
      complete: () => {
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
        done();
      },
    });

    http
      .expectOne(`${API_URL}/product/p-err`)
      .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
