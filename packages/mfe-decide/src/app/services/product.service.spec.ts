import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DECIDE_API_URL } from 'shared-catalog';
import type { Product, ProductResponse } from 'shared-catalog';
import { ProductService } from './product.service';

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
    service: TestBed.inject(ProductService),
    http: TestBed.inject(HttpTestingController),
  };
}

describe('ProductService', () => {
  afterEach(() => {
    const http = TestBed.inject(HttpTestingController);
    http.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  describe('getProduct()', () => {
    it('should GET /product/:id with correct URL', () => {
      const { service, http } = setup();
      service.getProduct('p-1').subscribe();
      const req = http.expectOne(`${API_URL}/product/p-1`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RESPONSE);
    });

    it('should return typed ProductResponse on success', (done) => {
      const { service, http } = setup();
      service.getProduct('p-1').subscribe((res) => {
        expect(res.data.id).toBe('p-1');
        expect(res.data.name).toBe('TractorMax 3000');
        done();
      });
      http.expectOne(`${API_URL}/product/p-1`).flush(MOCK_RESPONSE);
    });

    it('should propagate 404 without catching it internally', (done) => {
      const { service, http } = setup();
      service.getProduct('nope').subscribe({
        error: (err) => { expect(err).toBeDefined(); done(); },
      });
      http
        .expectOne(`${API_URL}/product/nope`)
        .flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should propagate 500 without catching it internally', (done) => {
      const { service, http } = setup();
      service.getProduct('p-1').subscribe({
        error: (err) => { expect(err).toBeDefined(); done(); },
      });
      http
        .expectOne(`${API_URL}/product/p-1`)
        .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should use DECIDE_API_URL token — not a hardcoded URL', () => {
      const custom = 'http://custom/decide/api';
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: DECIDE_API_URL, useValue: custom },
          ProductService,
        ],
      });
      const svc = TestBed.inject(ProductService);
      const ctrl = TestBed.inject(HttpTestingController);
      svc.getProduct('p-1').subscribe();
      ctrl.expectOne(`${custom}/product/p-1`).flush(MOCK_RESPONSE);
      ctrl.verify();
    });
  });
});
