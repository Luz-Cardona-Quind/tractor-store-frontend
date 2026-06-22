import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CatalogStore } from './catalog.store';
import { CatalogActions } from './catalog.actions';
import { CatalogService } from '../services/catalog.service';
import type { CategoryResponse, HomeResponse, Store } from 'shared-catalog';

const MOCK_HOME: HomeResponse = {
  categories: [{ id: 'c1', name: 'Campo', slug: 'campo', imageUrl: '/img/campo.jpg' }],
  recommendations: [{ id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: [] }],
  stores: [{ id: 's1', name: 'Tienda Central', address: 'Av. El Dorado 1', coordinates: { lat: 4.65, lng: -74.10 } }],
};

const MOCK_CATEGORY: CategoryResponse = {
  category: { id: 'c1', name: 'Campo', slug: 'campo', imageUrl: '/img/campo.jpg' },
  products: [{ id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: [] }],
  filters: [],
  total: 1,
};

const MOCK_STORE: Store = {
  id: 's1',
  name: 'Tienda Central Bogotá',
  address: 'Av. El Dorado 68B-31',
  coordinates: { lat: 4.65, lng: -74.10 },
};

describe('CatalogActions', () => {
  let store: CatalogStore;
  let actions: CatalogActions;
  let mockService: jest.Mocked<Pick<CatalogService, 'getHome' | 'getCategory'>>;

  beforeEach(() => {
    mockService = {
      getHome: jest.fn(),
      getCategory: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CatalogStore,
        CatalogActions,
        { provide: CatalogService, useValue: mockService },
      ],
    });

    store = TestBed.inject(CatalogStore);
    actions = TestBed.inject(CatalogActions);
  });

  // ── loadHome() ────────────────────────────────────────────────────────────

  it('loadHome() should set loading=true before the request completes', () => {
    mockService.getHome.mockReturnValue(of(MOCK_HOME));
    let loadingDuringCall = false;

    const originalUpdate = store.update.bind(store);
    jest.spyOn(store, 'update').mockImplementationOnce((updater) => {
      originalUpdate(updater);
      loadingDuringCall = store.snapshot().loading;
    });

    actions.loadHome();
    expect(mockService.getHome).toHaveBeenCalledTimes(1);
  });

  it('loadHome() should populate categories, recommendations and stores on success', () => {
    mockService.getHome.mockReturnValue(of(MOCK_HOME));
    actions.loadHome();

    const state = store.snapshot();
    expect(state.categories).toEqual(MOCK_HOME.categories);
    expect(state.recommendations).toEqual(MOCK_HOME.recommendations);
    expect(state.stores).toEqual(MOCK_HOME.stores);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('loadHome() should set error and clear loading on failure', () => {
    mockService.getHome.mockReturnValue(throwError(() => new Error('Network error')));
    actions.loadHome();

    const state = store.snapshot();
    expect(state.loading).toBe(false);
    expect(state.error).toMatch(/Intenta de nuevo/i);
  });

  it('loadHome() should reset error before each new call', () => {
    mockService.getHome
      .mockReturnValueOnce(throwError(() => new Error('fail')))
      .mockReturnValueOnce(of(MOCK_HOME));

    actions.loadHome();
    expect(store.snapshot().error).not.toBeNull();

    actions.loadHome();
    expect(store.snapshot().error).toBeNull();
  });

  // ── loadCategory() ───────────────────────────────────────────────────────

  it('loadCategory() should update activeCategory and categoryProducts on success', () => {
    mockService.getCategory.mockReturnValue(of(MOCK_CATEGORY));
    actions.loadCategory('campo');

    const state = store.snapshot();
    expect(state.activeCategory).toEqual(MOCK_CATEGORY.category);
    expect(state.categoryProducts).toEqual(MOCK_CATEGORY.products);
    expect(state.loading).toBe(false);
    expect(state.notFound).toBe(false);
  });

  it('loadCategory() should set notFound=true on 404 error', () => {
    mockService.getCategory.mockReturnValue(throwError(() => ({ status: 404 })));
    actions.loadCategory('inexistente');

    const state = store.snapshot();
    expect(state.notFound).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('loadCategory() should set error on non-404 failure', () => {
    mockService.getCategory.mockReturnValue(throwError(() => ({ status: 500 })));
    actions.loadCategory('campo');

    const state = store.snapshot();
    expect(state.notFound).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toMatch(/Intenta de nuevo/i);
  });

  it('loadCategory() should reset activeCategory and products before each new call', () => {
    mockService.getCategory.mockReturnValue(of(MOCK_CATEGORY));
    actions.loadCategory('campo');
    expect(store.snapshot().categoryProducts).toHaveLength(1);

    mockService.getCategory.mockReturnValue(throwError(() => ({ status: 500 })));
    actions.loadCategory('industrial');
    expect(store.snapshot().categoryProducts).toHaveLength(0);
  });

  // ── applyFilter() ─────────────────────────────────────────────────────────

  it('applyFilter() should merge the new filter into the existing activeFilters', () => {
    actions.applyFilter({ maxPrice: 50000 });
    expect(store.snapshot().activeFilters).toEqual({ maxPrice: 50000 });
  });

  it('applyFilter() should not remove other existing filters', () => {
    actions.applyFilter({ maxPrice: 50000 });
    actions.applyFilter({ maxPrice: 30000 });
    expect(store.snapshot().activeFilters.maxPrice).toBe(30000);
  });

  // ── clearFilters() ────────────────────────────────────────────────────────

  it('clearFilters() should reset activeFilters to empty object', () => {
    actions.applyFilter({ maxPrice: 50000 });
    actions.clearFilters();
    expect(store.snapshot().activeFilters).toEqual({});
  });

  // ── selectStore() ─────────────────────────────────────────────────────────

  it('selectStore() should persist the selected store in state', () => {
    actions.selectStore(MOCK_STORE);
    expect(store.snapshot().selectedStore).toEqual(MOCK_STORE);
  });

  it('selectStore() should replace a previously selected store', () => {
    const other: Store = { ...MOCK_STORE, id: 's2', name: 'Sucursal Medellín' };
    actions.selectStore(MOCK_STORE);
    actions.selectStore(other);
    expect(store.snapshot().selectedStore?.id).toBe('s2');
  });
});
