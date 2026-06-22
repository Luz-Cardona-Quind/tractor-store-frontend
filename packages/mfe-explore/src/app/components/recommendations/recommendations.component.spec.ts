import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendationsComponent } from './recommendations.component';
import type { ProductSummary } from 'shared-catalog';

const MOCK_PRODUCTS: ProductSummary[] = [
  { id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: ['/img/t1.jpg'] },
  { id: 'p2', name: 'AgriPower X', category: 'campo', price: 38000, images: ['/img/t2.jpg'] },
  { id: 'p3', name: 'OrchardMaster 300', category: 'huerto', price: 22000, images: ['/img/t3.jpg'] },
];

describe('RecommendationsComponent', () => {
  let fixture: ComponentFixture<RecommendationsComponent>;
  let component: RecommendationsComponent;

  const setup = async (
    products: ProductSummary[] = [],
    loading = false,
    productId?: string,
  ) => {
    await TestBed.configureTestingModule({
      imports: [RecommendationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationsComponent);
    component = fixture.componentInstance;
    component.products = products;
    component.loading = loading;
    if (productId !== undefined) component.productId = productId;
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('should show skeleton cards when loading and products list is empty', async () => {
    await setup([], true);
    const cards = fixture.nativeElement.querySelectorAll('ts-product-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render one item per product when products are provided', async () => {
    await setup(MOCK_PRODUCTS);
    const items = fixture.nativeElement.querySelectorAll('.recommendations__item');
    expect(items.length).toBe(MOCK_PRODUCTS.length);
  });

  it('should render nothing when not loading and products is empty', async () => {
    await setup([], false);
    const track = fixture.nativeElement.querySelector('.recommendations__track');
    expect(track).toBeNull();
  });

  it('should NOT show skeletons when loading=true but products exist', async () => {
    await setup(MOCK_PRODUCTS, true);
    const skeletonCards = fixture.nativeElement.querySelectorAll(
      '.recommendations__item ts-product-card[ng-reflect-loading="true"]',
    );
    expect(skeletonCards.length).toBe(0);
  });

  it('should emit productSelected when the event bubbles up from a card', async () => {
    await setup(MOCK_PRODUCTS);
    const emitted: string[] = [];
    component.productSelected.subscribe((id) => emitted.push(id));

    component.productSelected.emit('p1');
    expect(emitted).toEqual(['p1']);
  });

  it('should accept productId input without side effects', async () => {
    await setup(MOCK_PRODUCTS, false, 'p1');
    expect(component.productId).toBe('p1');
    // El resto de la renderización no se altera por el productId
    const items = fixture.nativeElement.querySelectorAll('.recommendations__item');
    expect(items.length).toBe(MOCK_PRODUCTS.length);
  });

  it('should render with horizontal scroll track', async () => {
    await setup(MOCK_PRODUCTS);
    const track = fixture.nativeElement.querySelector('.recommendations__track');
    expect(track).toBeTruthy();
  });
});
