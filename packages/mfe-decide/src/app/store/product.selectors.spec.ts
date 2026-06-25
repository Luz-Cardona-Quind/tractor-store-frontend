import { TestBed } from '@angular/core/testing';
import type { Product } from 'shared-catalog';
import { ProductStore } from './product.store';
import { ProductSelectors } from './product.selectors';

const MOCK_PRODUCT: Product = {
  id: 'p-1',
  name: 'TractorMax 3000',
  category: 'campo',
  price: 85_000,
  images: ['/img/campo.svg'],
  variants: [
    { sku: 'SKU-A', color: 'Verde', size: 'Grande',   stock: 5, price: 85_000 },
    { sku: 'SKU-B', color: 'Rojo',  size: 'Mediano',  stock: 0, price: 80_000 },
    { sku: 'SKU-C', color: 'Azul',  size: 'Pequeño',  stock: 2, price: 75_000 },
  ],
};

function setup() {
  TestBed.configureTestingModule({ providers: [ProductStore, ProductSelectors] });
  const store = TestBed.inject(ProductStore);
  const selectors = TestBed.inject(ProductSelectors);
  return { store, selectors };
}

describe('ProductSelectors', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('product()', () => {
    it('should return null initially', () => {
      const { selectors } = setup();
      expect(selectors.product()).toBeNull();
    });

    it('should reflect product set in store', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT }));
      expect(selectors.product()?.id).toBe('p-1');
    });
  });

  describe('selectedSku()', () => {
    it('should return null initially', () => {
      const { selectors } = setup();
      expect(selectors.selectedSku()).toBeNull();
    });

    it('should return selectedSku from store', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, selectedSku: 'SKU-A' }));
      expect(selectors.selectedSku()).toBe('SKU-A');
    });
  });

  describe('selectedVariant()', () => {
    it('should return null when no product', () => {
      const { selectors } = setup();
      expect(selectors.selectedVariant()).toBeNull();
    });

    it('should return null when product is set but selectedSku is null', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT, selectedSku: null }));
      expect(selectors.selectedVariant()).toBeNull();
    });

    it('should return matching variant when product and sku are set', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT, selectedSku: 'SKU-B' }));
      expect(selectors.selectedVariant()?.color).toBe('Rojo');
    });

    it('should return null for unknown sku', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT, selectedSku: 'NOPE' }));
      expect(selectors.selectedVariant()).toBeNull();
    });
  });

  describe('isOutOfStock()', () => {
    it('should be false when no variant is selected', () => {
      const { selectors } = setup();
      expect(selectors.isOutOfStock()).toBe(false);
    });

    it('should be true for variant with stock 0', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT, selectedSku: 'SKU-B' }));
      expect(selectors.isOutOfStock()).toBe(true);
    });

    it('should be false for variant with stock > 0', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT, selectedSku: 'SKU-A' }));
      expect(selectors.isOutOfStock()).toBe(false);
    });
  });

  describe('canAddToCart()', () => {
    it('should be false when no variant selected', () => {
      const { selectors } = setup();
      expect(selectors.canAddToCart()).toBe(false);
    });

    it('should be false for variant with stock 0', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT, selectedSku: 'SKU-B' }));
      expect(selectors.canAddToCart()).toBe(false);
    });

    it('should be true for variant with stock > 0', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, product: MOCK_PRODUCT, selectedSku: 'SKU-C' }));
      expect(selectors.canAddToCart()).toBe(true);
    });
  });

  describe('isLoading()', () => {
    it('should be false initially', () => {
      const { selectors } = setup();
      expect(selectors.isLoading()).toBe(false);
    });

    it('should reflect loading state from store', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, loading: true }));
      expect(selectors.isLoading()).toBe(true);
    });
  });

  describe('error()', () => {
    it('should be null initially', () => {
      const { selectors } = setup();
      expect(selectors.error()).toBeNull();
    });

    it('should reflect error from store', () => {
      const { store, selectors } = setup();
      store.update((s) => ({ ...s, error: 'Error de red.' }));
      expect(selectors.error()).toBe('Error de red.');
    });
  });
});
