import { TestBed } from '@angular/core/testing';
import { CatalogStore } from './catalog.store';
import type { CatalogState } from './catalog.store';

describe('CatalogStore', () => {
  let store: CatalogStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CatalogStore] });
    store = TestBed.inject(CatalogStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should expose the initial state via snapshot()', () => {
    const state = store.snapshot();
    expect(state.categories).toEqual([]);
    expect(state.recommendations).toEqual([]);
    expect(state.stores).toEqual([]);
    expect(state.activeCategory).toBeNull();
    expect(state.categoryProducts).toEqual([]);
    expect(state.activeFilters).toEqual({});
    expect(state.notFound).toBe(false);
    expect(state.selectedStore).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should apply a loading transition immutably', () => {
    store.update((s) => ({ ...s, loading: true }));
    expect(store.snapshot().loading).toBe(true);
  });

  it('should apply an error transition immutably', () => {
    const msg = 'No pudimos cargar el catálogo. Intenta de nuevo.';
    store.update((s) => ({ ...s, error: msg }));
    expect(store.snapshot().error).toBe(msg);
  });

  it('should update categories without touching other fields', () => {
    const cats = [{ id: 'c1', name: 'Campo', slug: 'campo', imageUrl: '/img/c.jpg' }];
    store.update((s) => ({ ...s, categories: cats }));

    const state = store.snapshot();
    expect(state.categories).toEqual(cats);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should update notFound flag correctly', () => {
    store.update((s) => ({ ...s, notFound: true }));
    expect(store.snapshot().notFound).toBe(true);
  });

  it('should accumulate multiple transitions', () => {
    store.update((s) => ({ ...s, loading: true }));
    store.update((s) => ({ ...s, loading: false, error: 'Algo salió mal.' }));

    const state = store.snapshot();
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Algo salió mal.');
  });

  it('should keep snapshot readonly — updater cannot mutate in-place', () => {
    const before = store.snapshot();
    store.update((s) => ({ ...s, loading: true }));
    // snapshot() obtiene la referencia actual, pero before fue capturado antes
    expect(before).not.toBe(store.snapshot());
  });

  it('should set selectedStore', () => {
    const mockStore = {
      id: 's1',
      name: 'Tienda Central',
      address: 'Av. Principal 1',
      coordinates: { lat: 4.71, lng: -74.07 },
    };
    store.update((s) => ({ ...s, selectedStore: mockStore }));
    expect(store.snapshot().selectedStore).toEqual(mockStore);
  });

  it('should update activeFilters', () => {
    store.update((s) => ({ ...s, activeFilters: { maxPrice: 50000 } }));
    expect(store.snapshot().activeFilters).toEqual({ maxPrice: 50000 });
  });

  it('snapshot() type satisfies CatalogState', () => {
    const state: CatalogState = store.snapshot();
    expect(state).toBeDefined();
  });
});
