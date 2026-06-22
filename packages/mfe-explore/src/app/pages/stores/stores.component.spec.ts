import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { StoresComponent } from './stores.component';
import { CatalogFacadeService } from '../../services/catalog-facade.service';
import type { Store } from 'shared-catalog';

const MOCK_STORES: Store[] = [
  { id: 'store-1', name: 'Tienda Central Bogotá', address: 'Av. El Dorado #68B-31, Bogotá', coordinates: { lat: 4.65, lng: -74.10 } },
  { id: 'store-2', name: 'Sucursal Medellín',     address: 'Cra. 43A #1 Sur-100, Medellín',  coordinates: { lat: 6.24, lng: -75.58 } },
];

const buildFacade = (overrides: {
  stores?: Store[];
  selectedStore?: Store | null;
  loading?: boolean;
  error?: string | null;
  loadHome?: jest.Mock;
  selectStore?: jest.Mock;
} = {}) => ({
  stores:        signal(overrides.stores        ?? []),
  selectedStore: signal(overrides.selectedStore ?? null),
  isLoading:     signal(overrides.loading       ?? false),
  error:         signal(overrides.error         ?? null),
  loadHome:      overrides.loadHome  ?? jest.fn(),
  selectStore:   overrides.selectStore ?? jest.fn(),
  // rest of facade (unused by this component)
  categories:        signal([]),
  recommendations:   signal([]),
  activeCategory:    signal(null),
  filteredProducts:  signal([]),
  activeFilters:     signal({}),
  activeFilterCount: signal(0),
  notFound:          signal(false),
  loadCategory:      jest.fn(),
  applyFilter:       jest.fn(),
  clearFilters:      jest.fn(),
});

describe('StoresComponent', () => {
  let fixture: ComponentFixture<StoresComponent>;

  const setup = async (facade: ReturnType<typeof buildFacade>) => {
    await TestBed.configureTestingModule({
      imports: [StoresComponent],
      providers: [{ provide: CatalogFacadeService, useValue: facade }],
    }).compileComponents();

    fixture = TestBed.createComponent(StoresComponent);
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    await setup(buildFacade({ stores: MOCK_STORES }));
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call loadHome() when stores are empty', async () => {
    const loadHome = jest.fn();
    await setup(buildFacade({ stores: [], loadHome }));
    expect(loadHome).toHaveBeenCalled();
  });

  it('should NOT call loadHome() when stores are already loaded', async () => {
    const loadHome = jest.fn();
    await setup(buildFacade({ stores: MOCK_STORES, loadHome }));
    expect(loadHome).not.toHaveBeenCalled();
  });

  it('should render a store-picker per store', async () => {
    await setup(buildFacade({ stores: MOCK_STORES }));
    const pickers = fixture.nativeElement.querySelectorAll('explore-store-picker');
    expect(pickers.length).toBe(MOCK_STORES.length);
  });

  it('should show skeleton rows while loading', async () => {
    await setup(buildFacade({ stores: [], loading: true }));
    const skeletons = fixture.nativeElement.querySelectorAll('.stores__skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show empty state when stores list is empty and not loading', async () => {
    await setup(buildFacade({ stores: [], loading: false }));
    const empty = fixture.nativeElement.querySelector('.stores__empty');
    expect(empty).toBeTruthy();
  });

  it('should show error message when error is set', async () => {
    const msg = 'No pudimos cargar el catálogo. Intenta de nuevo.';
    await setup(buildFacade({ stores: [], error: msg }));
    const el = fixture.nativeElement.querySelector('.stores__error-text');
    expect(el.textContent).toContain(msg);
  });

  it('should call facade.selectStore() when a store-picker emits storeSelected', async () => {
    const selectStore = jest.fn();
    await setup(buildFacade({ stores: MOCK_STORES, selectStore }));

    fixture.componentInstance['onStoreSelected'](MOCK_STORES[0]);
    expect(selectStore).toHaveBeenCalledWith(MOCK_STORES[0]);
  });

  it('should display the selected-hint when a store is selected', async () => {
    await setup(buildFacade({ stores: MOCK_STORES, selectedStore: MOCK_STORES[0] }));
    const hint = fixture.nativeElement.querySelector('.stores__selected-hint');
    expect(hint.textContent).toContain('Tienda Central Bogotá');
  });

  it('should NOT display the selected-hint when no store is selected', async () => {
    await setup(buildFacade({ stores: MOCK_STORES, selectedStore: null }));
    const hint = fixture.nativeElement.querySelector('.stores__selected-hint');
    expect(hint).toBeNull();
  });
});
