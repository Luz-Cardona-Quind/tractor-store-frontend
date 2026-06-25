import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DECIDE_API_URL } from 'shared-catalog';
import type { Product, ProductResponse } from 'shared-catalog';
import { ProductStore } from './product.store';
import { ProductSelectors } from './product.selectors';
import { ProductActions } from './product.actions';
import { ProductService } from '../services/product.service';

const API_URL = 'http://localhost:8080/decide/api';

const MOCK_PRODUCT: Product = {
  id: 'p-1',
  name: 'TractorMax 3000',
  category: 'campo',
  price: 85_000,
  images: ['/img/campo.svg'],
  variants: [
    { sku: 'SKU-A', color: 'Verde', size: 'Grande',  stock: 5, price: 85_000 },
    { sku: 'SKU-B', color: 'Rojo',  size: 'Mediano', stock: 0, price: 80_000 },
  ],
};

const MOCK_RESPONSE: ProductResponse = { data: MOCK_PRODUCT };

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: DECIDE_API_URL, useValue: API_URL },
      ProductStore,
      ProductSelectors,
      ProductService,
      ProductActions,
    ],
  });
  return {
    store: TestBed.inject(ProductStore),
    selectors: TestBed.inject(ProductSelectors),
    actions: TestBed.inject(ProductActions),
    http: TestBed.inject(HttpTestingController),
  };
}

describe('ProductActions', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('loadProduct()', () => {
    it('should set loading=true while in flight', () => {
      const { actions, selectors, http } = setup();
      actions.loadProduct('p-1');
      expect(selectors.isLoading()).toBe(true);
      http.expectOne(`${API_URL}/product/p-1`).flush(MOCK_RESPONSE);
    });

    it('should populate product and clear loading on success', () => {
      const { actions, selectors, http } = setup();
      actions.loadProduct('p-1');
      http.expectOne(`${API_URL}/product/p-1`).flush(MOCK_RESPONSE);
      expect(selectors.product()?.id).toBe('p-1');
      expect(selectors.isLoading()).toBe(false);
    });

    it('should auto-select first variant with stock on success', () => {
      const { actions, selectors, http } = setup();
      actions.loadProduct('p-1');
      http.expectOne(`${API_URL}/product/p-1`).flush(MOCK_RESPONSE);
      // SKU-A tiene stock, SKU-B no
      expect(selectors.selectedSku()).toBe('SKU-A');
    });

    it('should auto-select first variant when all are out of stock', () => {
      const noStockProduct: Product = {
        ...MOCK_PRODUCT,
        variants: [
          { sku: 'SKU-X', color: 'Gris', size: 'Único', stock: 0, price: 70_000 },
        ],
      };
      const { actions, selectors, http } = setup();
      actions.loadProduct('p-1');
      http.expectOne(`${API_URL}/product/p-1`).flush({ data: noStockProduct });
      expect(selectors.selectedSku()).toBe('SKU-X');
    });

    it('should set error message and clear loading on HTTP error', () => {
      const { actions, selectors, http } = setup();
      actions.loadProduct('p-1');
      http
        .expectOne(`${API_URL}/product/p-1`)
        .flush('Not Found', { status: 404, statusText: 'Not Found' });
      expect(selectors.isLoading()).toBe(false);
      expect(selectors.error()).toBeTruthy();
    });

    it('should reset product to null before a new load', () => {
      const { store, actions, selectors, http } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT }));
      actions.loadProduct('p-2');
      expect(selectors.product()).toBeNull();
      http.expectOne(`${API_URL}/product/p-2`).flush(MOCK_RESPONSE);
    });
  });

  describe('setProduct()', () => {
    it('should populate product without making HTTP request', () => {
      const { actions, selectors } = setup();
      actions.setProduct(MOCK_PRODUCT);
      expect(selectors.product()?.id).toBe('p-1');
    });

    it('should auto-select first variant with stock', () => {
      const { actions, selectors } = setup();
      actions.setProduct(MOCK_PRODUCT);
      expect(selectors.selectedSku()).toBe('SKU-A');
    });
  });

  describe('selectVariant()', () => {
    it('should update selectedSku', () => {
      const { actions, selectors } = setup();
      actions.selectVariant('SKU-B');
      expect(selectors.selectedSku()).toBe('SKU-B');
    });
  });

  describe('clearProduct()', () => {
    it('should reset all state to initial values', () => {
      const { store, actions, selectors } = setup();
      store.update((s) => ({
        ...s,
        product: MOCK_PRODUCT,
        selectedSku: 'SKU-A',
        error: 'prev error',
      }));
      actions.clearProduct();
      expect(selectors.product()).toBeNull();
      expect(selectors.selectedSku()).toBeNull();
      expect(selectors.error()).toBeNull();
      expect(selectors.isLoading()).toBe(false);
    });
  });
});
