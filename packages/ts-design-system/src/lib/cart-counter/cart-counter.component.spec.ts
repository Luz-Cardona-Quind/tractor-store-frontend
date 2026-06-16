import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { LineItem } from 'shared-catalog';
import { TsCartCounterComponent } from './cart-counter.component';

const MOCK_ITEM: LineItem = {
  sku: 'sku-001',
  productId: 'prod-1',
  productName: 'Tractor Pro 5000',
  color: 'Verde',
  size: 'L',
  price: 45000,
  quantity: 1,
};

function dispatchCartUpdated(items: LineItem[]): void {
  document.dispatchEvent(
    new CustomEvent('checkout:cart-updated', {
      detail: { items, total: items.reduce((sum, i) => sum + i.price * i.quantity, 0) },
      bubbles: true,
      composed: true,
    }),
  );
}

function getShadowBadge(fixture: ComponentFixture<TsCartCounterComponent>): Element | null {
  return fixture.nativeElement.shadowRoot?.querySelector('.ts-cart-counter') ?? null;
}

describe('TsCartCounterComponent', () => {
  let fixture: ComponentFixture<TsCartCounterComponent>;
  let component: TsCartCounterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsCartCounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TsCartCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Estado inicial ────────────────────────────────────────────────────────

  it('should not render the badge when count is 0', () => {
    expect(getShadowBadge(fixture)).toBeNull();
  });

  it('should start with count equal to 0', () => {
    expect((component as any).count()).toBe(0);
  });

  // ── Input itemCount ───────────────────────────────────────────────────────

  it('should render the badge when itemCount input is set', () => {
    fixture.componentRef.setInput('itemCount', 3);
    fixture.detectChanges();
    expect(getShadowBadge(fixture)).toBeTruthy();
  });

  it('should display the correct count from itemCount input', () => {
    fixture.componentRef.setInput('itemCount', 5);
    fixture.detectChanges();
    expect(getShadowBadge(fixture)?.textContent?.trim()).toBe('5');
  });

  it('should hide badge when itemCount is set to 0', () => {
    fixture.componentRef.setInput('itemCount', 3);
    fixture.detectChanges();
    fixture.componentRef.setInput('itemCount', 0);
    fixture.detectChanges();
    expect(getShadowBadge(fixture)).toBeNull();
  });

  // ── Evento checkout:cart-updated ──────────────────────────────────────────

  it('should update count when checkout:cart-updated is dispatched', () => {
    dispatchCartUpdated([MOCK_ITEM, { ...MOCK_ITEM, sku: 'sku-002' }]);
    fixture.detectChanges();
    expect((component as any).count()).toBe(2);
  });

  it('should render badge after receiving cart-updated event', () => {
    dispatchCartUpdated([MOCK_ITEM]);
    fixture.detectChanges();
    expect(getShadowBadge(fixture)).toBeTruthy();
    expect(getShadowBadge(fixture)?.textContent?.trim()).toBe('1');
  });

  it('should hide badge when cart-updated event reports empty cart', () => {
    dispatchCartUpdated([MOCK_ITEM]);
    fixture.detectChanges();
    dispatchCartUpdated([]);
    fixture.detectChanges();
    expect(getShadowBadge(fixture)).toBeNull();
  });

  // ── Accesibilidad ─────────────────────────────────────────────────────────

  it('should set aria-label with singular for one item', () => {
    fixture.componentRef.setInput('itemCount', 1);
    fixture.detectChanges();
    expect(getShadowBadge(fixture)?.getAttribute('aria-label')).toBe('1 artículo en el carrito');
  });

  it('should set aria-label with plural for multiple items', () => {
    fixture.componentRef.setInput('itemCount', 4);
    fixture.detectChanges();
    expect(getShadowBadge(fixture)?.getAttribute('aria-label')).toBe('4 artículos en el carrito');
  });
});
