import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsProductCardComponent } from './product-card.component';
import { ProductSummary } from 'shared-catalog';

const MOCK_PRODUCT: ProductSummary = {
  id: 'prod-1',
  name: 'Tractor Pro 5000',
  category: 'tractors',
  price: 45000,
  images: ['https://example.com/tractor.jpg'],
};

const PRODUCT_NO_IMAGE: ProductSummary = {
  ...MOCK_PRODUCT,
  id: 'prod-2',
  images: [],
};

describe('TsProductCardComponent', () => {
  let fixture: ComponentFixture<TsProductCardComponent>;
  let component: TsProductCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TsProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', MOCK_PRODUCT);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Render con producto completo ───────────────────────────────────────────

  it('should render the product name', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('.ts-product-card__title');
    expect(title.textContent?.trim()).toBe('Tractor Pro 5000');
  });

  it('should render the price by default', () => {
    const price: HTMLElement = fixture.nativeElement.querySelector('.ts-product-card__price');
    expect(price).toBeTruthy();
    expect(price.textContent?.trim()).toContain('45');
  });

  it('should render the image with loading=lazy', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.ts-product-card__image');
    expect(img).toBeTruthy();
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('src')).toBe('https://example.com/tractor.jpg');
  });

  it('should use empty string as src when images array is empty', () => {
    fixture.componentRef.setInput('product', PRODUCT_NO_IMAGE);
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.ts-product-card__image');
    expect(img.getAttribute('src')).toBe('');
  });

  it('should set fallback src on image error', () => {
    const img = document.createElement('img');
    const event = new Event('error');
    Object.defineProperty(event, 'target', { value: img });
    component.handleImageError(event);
    expect(img.src).toContain('data:image/svg+xml');
  });

  // ── Sin precio ────────────────────────────────────────────────────────────

  it('should hide price when showPrice=false', () => {
    fixture.componentRef.setInput('showPrice', false);
    fixture.detectChanges();
    const price = fixture.nativeElement.querySelector('.ts-product-card__price');
    expect(price).toBeNull();
  });

  // ── Estado loading ────────────────────────────────────────────────────────

  it('should render the skeleton when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.ts-product-card--skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('should not render the article when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('article');
    expect(article).toBeNull();
  });

  it('should set aria-busy on the skeleton', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const skeleton: HTMLElement = fixture.nativeElement.querySelector('.ts-product-card--skeleton');
    expect(skeleton.getAttribute('aria-busy')).toBe('true');
  });

  // ── Emisión de productSelected ────────────────────────────────────────────

  it('should emit productSelected with product id on click', () => {
    const spy = jest.spyOn(component.productSelected, 'emit');
    const btn: HTMLElement = fixture.nativeElement.querySelector('.ts-product-card__overlay');
    btn.click();
    expect(spy).toHaveBeenCalledWith('prod-1');
  });

  it('should not emit productSelected when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spy = jest.spyOn(component.productSelected, 'emit');
    component.handleClick();
    expect(spy).not.toHaveBeenCalled();
  });
});
