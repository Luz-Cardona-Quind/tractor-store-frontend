import { TestBed } from '@angular/core/testing';
import { CatalogStore } from './catalog.store';
import { CatalogSelectors } from './catalog.selectors';
import type { Category, ProductSummary, Store } from 'shared-catalog';

const CAT: Category = { id: 'c1', name: 'Campo', slug: 'campo', imageUrl: '/img/campo.jpg' };

const PRODUCTS: ProductSummary[] = [
  { id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: [] },
  { id: 'p2', name: 'AgriPower X',     category: 'campo', price: 22000, images: [] },
  { id: 'p3', name: 'TerraForce 250',  category: 'campo', price: 60000, images: [] },
];

const STORE: Store = {
  id: 's1',
  name: 'Tienda Central Bogotá',
  address: 'Av. El Dorado 68B-31',
  coordinates: { lat: 4.65, lng: -74.10 },
};

describe('CatalogSelectors', () => {
  let store: CatalogStore;
  let selectors: CatalogSelectors;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CatalogStore, CatalogSelectors] });
    store = TestBed.inject(CatalogStore);
    selectors = TestBed.inject(CatalogSelectors);
  });

  // ── Home ──────────────────────────────────────────────────────────────────

  it('categories() should reflect store state', () => {
    expect(selectors.categories()).toEqual([]);
    store.update((s) => ({ ...s, categories: [CAT] }));
    expect(selectors.categories()).toEqual([CAT]);
  });

  it('recommendations() should reflect store state', () => {
    store.update((s) => ({ ...s, recommendations: [PRODUCTS[0]] }));
    expect(selectors.recommendations()).toEqual([PRODUCTS[0]]);
  });

  it('stores() should reflect store state', () => {
    store.update((s) => ({ ...s, stores: [STORE] }));
    expect(selectors.stores()).toEqual([STORE]);
  });

  // ── Category page ─────────────────────────────────────────────────────────

  it('activeCategory() should reflect store state', () => {
    expect(selectors.activeCategory()).toBeNull();
    store.update((s) => ({ ...s, activeCategory: CAT }));
    expect(selectors.activeCategory()).toEqual(CAT);
  });

  it('filteredProducts() should return all products when no maxPrice filter is set', () => {
    store.update((s) => ({ ...s, categoryProducts: PRODUCTS, activeFilters: {} }));
    expect(selectors.filteredProducts()).toHaveLength(PRODUCTS.length);
  });

  it('filteredProducts() should filter by maxPrice when set', () => {
    store.update((s) => ({
      ...s,
      categoryProducts: PRODUCTS,
      activeFilters: { maxPrice: 50000 },
    }));
    const filtered = selectors.filteredProducts();
    expect(filtered.every((p) => p.price <= 50000)).toBe(true);
    expect(filtered).toHaveLength(2); // p1=45000, p2=22000; p3=60000 excluido
  });

  it('filteredProducts() should return empty when all exceed maxPrice', () => {
    store.update((s) => ({
      ...s,
      categoryProducts: PRODUCTS,
      activeFilters: { maxPrice: 1000 },
    }));
    expect(selectors.filteredProducts()).toHaveLength(0);
  });

  it('activeFilterCount() should be 0 when no filters are active', () => {
    store.update((s) => ({ ...s, activeFilters: {} }));
    expect(selectors.activeFilterCount()).toBe(0);
  });

  it('activeFilterCount() should count each defined filter', () => {
    store.update((s) => ({ ...s, activeFilters: { maxPrice: 50000 } }));
    expect(selectors.activeFilterCount()).toBe(1);
  });

  it('activeFilterCount() should ignore undefined values', () => {
    store.update((s) => ({ ...s, activeFilters: { maxPrice: undefined } }));
    expect(selectors.activeFilterCount()).toBe(0);
  });

  it('notFound() should reflect store state', () => {
    expect(selectors.notFound()).toBe(false);
    store.update((s) => ({ ...s, notFound: true }));
    expect(selectors.notFound()).toBe(true);
  });

  // ── Stores page ───────────────────────────────────────────────────────────

  it('selectedStore() should start as null', () => {
    expect(selectors.selectedStore()).toBeNull();
  });

  it('selectedStore() should reflect store state', () => {
    store.update((s) => ({ ...s, selectedStore: STORE }));
    expect(selectors.selectedStore()).toEqual(STORE);
  });

  // ── UI ────────────────────────────────────────────────────────────────────

  it('isLoading() should reflect store state', () => {
    expect(selectors.isLoading()).toBe(false);
    store.update((s) => ({ ...s, loading: true }));
    expect(selectors.isLoading()).toBe(true);
  });

  it('error() should start as null', () => {
    expect(selectors.error()).toBeNull();
  });

  it('error() should reflect store state', () => {
    const msg = 'No pudimos cargar el catálogo. Intenta de nuevo.';
    store.update((s) => ({ ...s, error: msg }));
    expect(selectors.error()).toBe(msg);
  });

  it('filteredProducts() should update reactively when store changes', () => {
    store.update((s) => ({ ...s, categoryProducts: PRODUCTS, activeFilters: {} }));
    expect(selectors.filteredProducts()).toHaveLength(3);

    store.update((s) => ({ ...s, activeFilters: { maxPrice: 30000 } }));
    expect(selectors.filteredProducts()).toHaveLength(1); // solo p2=22000
  });
});
