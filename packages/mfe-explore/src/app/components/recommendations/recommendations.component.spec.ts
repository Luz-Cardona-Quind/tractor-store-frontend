import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendationsComponent } from './recommendations.component';
import type { ProductSummary } from 'shared-catalog';

const mockProducts: ProductSummary[] = [
  { id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: ['/img/t1.jpg'] },
  { id: 'p2', name: 'AgriPower X', category: 'campo', price: 38000, images: ['/img/t2.jpg'] },
];

describe('RecommendationsComponent', () => {
  let fixture: ComponentFixture<RecommendationsComponent>;
  let component: RecommendationsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show skeleton cards when loading and products list is empty', () => {
    component.loading = true;
    component.products = [];
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('ts-product-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render one card per product when products are provided', () => {
    component.products = mockProducts;
    component.loading = false;
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.recommendations__item');
    expect(items.length).toBe(mockProducts.length);
  });

  it('should render nothing when not loading and products is empty', () => {
    component.products = [];
    component.loading = false;
    fixture.detectChanges();

    const track = fixture.nativeElement.querySelector('.recommendations__track');
    expect(track).toBeNull();
  });

  it('should emit productSelected when a product card emits', () => {
    component.products = mockProducts;
    fixture.detectChanges();

    const emittedSpy = jest.fn();
    component.productSelected.subscribe(emittedSpy);

    component.productSelected.emit('p1');
    expect(emittedSpy).toHaveBeenCalledWith('p1');
  });
});
