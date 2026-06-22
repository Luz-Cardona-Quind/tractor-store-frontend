import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { CategoryComponent } from './category.component';
import { CatalogFacadeService } from '../../services/catalog-facade.service';
import type { Category, FilterState, ProductSummary } from 'shared-catalog';

const mockCategory: Category = {
  id: 'c1',
  name: 'Tractores de campo',
  slug: 'campo',
  imageUrl: '/img/campo.jpg',
};

const mockProducts: ProductSummary[] = [
  { id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: ['/img/t1.jpg'] },
  { id: 'p2', name: 'AgriPower X',     category: 'campo', price: 18000, images: ['/img/t2.jpg'] },
  { id: 'p3', name: 'FieldRunner Pro', category: 'campo', price: 95000, images: ['/img/t3.jpg'] },
];

const buildFacade = (overrides: {
  activeCategory?: Category | null;
  filteredProducts?: ProductSummary[];
  loading?: boolean;
  error?: string | null;
  notFound?: boolean;
  activeFilterCount?: number;
  activeFilters?: FilterState;
  loadCategory?: jest.Mock;
  applyFilter?: jest.Mock;
  clearFilters?: jest.Mock;
} = {}) => ({
  activeCategory:    signal(overrides.activeCategory    ?? null),
  filteredProducts:  signal(overrides.filteredProducts  ?? []),
  isLoading:         signal(overrides.loading           ?? false),
  error:             signal(overrides.error             ?? null),
  notFound:          signal(overrides.notFound          ?? false),
  activeFilterCount: signal(overrides.activeFilterCount ?? 0),
  activeFilters:     signal(overrides.activeFilters     ?? {}),
  loadCategory:  overrides.loadCategory  ?? jest.fn(),
  applyFilter:   overrides.applyFilter   ?? jest.fn(),
  clearFilters:  overrides.clearFilters  ?? jest.fn(),
  loadHome: jest.fn(),
  recommendations: signal([]),
  categories: signal([]),
});

const buildRoute = (slug: string, maxPrice?: string) => {
  const paramSubject    = new Subject<ReturnType<typeof convertToParamMap>>();
  const querySubject    = new Subject<ReturnType<typeof convertToParamMap>>();
  return {
    paramMap:      paramSubject.asObservable(),
    queryParamMap: querySubject.asObservable(),
    _emit(s = slug, mp = maxPrice) {
      paramSubject.next(convertToParamMap({ slug: s }));
      querySubject.next(convertToParamMap(mp ? { maxPrice: mp } : {}));
    },
  };
};

describe('CategoryComponent', () => {
  let fixture: ComponentFixture<CategoryComponent>;
  let router: { navigate: jest.Mock };

  const setup = async (
    facade: ReturnType<typeof buildFacade>,
    route: ReturnType<typeof buildRoute>,
  ) => {
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CategoryComponent],
      providers: [
        { provide: CatalogFacadeService, useValue: facade },
        { provide: ActivatedRoute,       useValue: route },
        { provide: Router,               useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade(), route);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call loadCategory when slug param emits', async () => {
    const loadCategory = jest.fn();
    const route = buildRoute('campo');
    await setup(buildFacade({ loadCategory }), route);

    route._emit('campo');

    expect(loadCategory).toHaveBeenCalledWith('campo');
  });

  it('should reload when slug changes (category navigation)', async () => {
    const loadCategory = jest.fn();
    const route = buildRoute('campo');
    await setup(buildFacade({ loadCategory }), route);

    route._emit('campo');
    route._emit('industrial');

    expect(loadCategory).toHaveBeenCalledTimes(2);
    expect(loadCategory).toHaveBeenNthCalledWith(2, 'industrial');
  });

  it('should render one product card per filtered product', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade({ filteredProducts: mockProducts }), route);

    const cards = fixture.nativeElement.querySelectorAll('ts-product-card');
    expect(cards.length).toBe(mockProducts.length);
  });

  it('should display the category name', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade({ activeCategory: mockCategory }), route);

    const title = fixture.nativeElement.querySelector('.category__title');
    expect(title.textContent).toContain('Tractores de campo');
  });

  it('should show skeleton cards while loading', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade({ loading: true }), route);

    const cards = fixture.nativeElement.querySelectorAll('ts-product-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should show "Categoría no encontrada" on 404', async () => {
    const route = buildRoute('inexistente');
    await setup(buildFacade({ notFound: true }), route);

    const el = fixture.nativeElement.querySelector('.category__not-found-text');
    expect(el.textContent).toContain('Categoría no encontrada');
  });

  it('should show error message on server error', async () => {
    const msg = 'No pudimos cargar la categoría. Intenta de nuevo.';
    const route = buildRoute('campo');
    await setup(buildFacade({ error: msg }), route);

    const el = fixture.nativeElement.querySelector('.category__error-text');
    expect(el.textContent).toContain(msg);
  });

  it('should show empty state when filteredProducts is empty and not loading', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade({ filteredProducts: [], loading: false, activeCategory: mockCategory }), route);

    const empty = fixture.nativeElement.querySelector('.category__empty');
    expect(empty).toBeTruthy();
  });

  it('should show clear-filters button only when activeFilterCount > 0', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade({ activeFilterCount: 1 }), route);

    const btn = fixture.nativeElement.querySelector('.category__clear-filters');
    expect(btn).toBeTruthy();
  });

  it('should NOT show clear-filters button when activeFilterCount is 0', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade({ activeFilterCount: 0 }), route);

    const btn = fixture.nativeElement.querySelector('.category__clear-filters');
    expect(btn).toBeNull();
  });

  it('should call clearFilters on facade and navigate without queryParams when clearing', async () => {
    const clearFilters = jest.fn();
    const route = buildRoute('campo', '50000');
    await setup(buildFacade({ activeFilterCount: 1, clearFilters }), route);

    (fixture.componentInstance as any).clearFilters();
    expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: route, queryParams: {} });
  });

  it('should navigate to /product/:id when a product card is selected', async () => {
    const route = buildRoute('campo');
    await setup(buildFacade({ filteredProducts: mockProducts }), route);

    (fixture.componentInstance as any).navigateToProduct('p1');
    expect(router.navigate).toHaveBeenCalledWith(['/product', 'p1']);
  });

  it('should apply maxPrice filter when query param is present', async () => {
    const applyFilter = jest.fn();
    const route = buildRoute('campo');
    await setup(buildFacade({ applyFilter }), route);

    route._emit('campo', '50000');

    expect(applyFilter).toHaveBeenCalledWith({ maxPrice: 50000 });
  });

  it('should clear filters when maxPrice query param is removed', async () => {
    const clearFilters = jest.fn();
    const route = buildRoute('campo');
    await setup(buildFacade({ clearFilters }), route);

    route._emit('campo');

    expect(clearFilters).toHaveBeenCalled();
  });
});
