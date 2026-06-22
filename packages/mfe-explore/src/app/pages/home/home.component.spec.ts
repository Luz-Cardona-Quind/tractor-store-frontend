import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { HomeComponent } from './home.component';
import { CatalogFacadeService } from '../../services/catalog-facade.service';
import type { Category, ProductSummary } from 'shared-catalog';

const mockCategories: Category[] = [
  { id: 'c1', name: 'Tractores de campo', slug: 'campo', imageUrl: '/img/campo.jpg' },
  { id: 'c2', name: 'Tractores industriales', slug: 'industrial', imageUrl: '/img/industrial.jpg' },
];

const mockRecommendations: ProductSummary[] = [
  { id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: ['/img/t1.jpg'] },
];

const buildFacade = (overrides: Partial<{
  categories: Category[];
  recommendations: ProductSummary[];
  loading: boolean;
  error: string | null;
  loadHome: jest.Mock;
}> = {}) => ({
  categories: signal(overrides.categories ?? []),
  recommendations: signal(overrides.recommendations ?? []),
  isLoading: signal(overrides.loading ?? false),
  error: signal(overrides.error ?? null),
  loadHome: overrides.loadHome ?? jest.fn(),
});

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let router: Router;

  const setup = async (facade: ReturnType<typeof buildFacade>) => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: CatalogFacadeService, useValue: facade },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    await setup(buildFacade());
    expect(component).toBeTruthy();
  });

  it('should call facade.loadHome() on init', async () => {
    const loadHome = jest.fn();
    await setup(buildFacade({ loadHome }));
    expect(loadHome).toHaveBeenCalledTimes(1);
  });

  it('should render one category card per category', async () => {
    await setup(buildFacade({ categories: mockCategories }));
    const cards = fixture.nativeElement.querySelectorAll('ts-product-card');
    expect(cards.length).toBeGreaterThanOrEqual(mockCategories.length);
  });

  it('should show skeleton cards while loading with empty categories', async () => {
    await setup(buildFacade({ loading: true, categories: [] }));
    const cards = fixture.nativeElement.querySelectorAll('ts-product-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render the recommendations section', async () => {
    await setup(buildFacade({ recommendations: mockRecommendations }));
    const section = fixture.nativeElement.querySelector('explore-recommendations');
    expect(section).toBeTruthy();
  });

  it('should display an error message when error is present', async () => {
    const errorMsg = 'No pudimos cargar el catálogo. Intenta de nuevo.';
    await setup(buildFacade({ error: errorMsg }));
    const errorEl = fixture.nativeElement.querySelector('.home__error');
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain(errorMsg);
  });

  it('should navigate to /category/:slug when a category card is selected', async () => {
    await setup(buildFacade({ categories: mockCategories }));
    (component as any).navigateToCategory('campo');
    expect((router.navigate as jest.Mock)).toHaveBeenCalledWith(['/category', 'campo']);
  });

  it('should navigate to /product/:id when a recommendation is selected', async () => {
    await setup(buildFacade({ recommendations: mockRecommendations }));
    (component as any).navigateToProduct('p1');
    expect((router.navigate as jest.Mock)).toHaveBeenCalledWith(['/product', 'p1']);
  });

  it('should map category to ProductSummary using slug as id', async () => {
    await setup(buildFacade());
    const cat = mockCategories[0];
    const card = (component as any).categoryToCard(cat);
    expect(card.id).toBe(cat.slug);
    expect(card.name).toBe(cat.name);
    expect(card.images[0]).toBe(cat.imageUrl);
  });
});
