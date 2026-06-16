import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { LineItem } from 'shared-catalog';
import { TsMiniCartComponent } from './mini-cart.component';

const MOCK_ITEMS: LineItem[] = [
  {
    sku: 'sku-001',
    productId: 'prod-1',
    productName: 'Tractor Pro 5000',
    color: 'Verde',
    size: 'L',
    price: 45000,
    quantity: 1,
  },
  {
    sku: 'sku-002',
    productId: 'prod-2',
    productName: 'Tractor Basic 2000',
    color: 'Rojo',
    size: 'M',
    price: 18000,
    quantity: 2,
  },
];

describe('TsMiniCartComponent', () => {
  let fixture: ComponentFixture<TsMiniCartComponent>;
  let component: TsMiniCartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsMiniCartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TsMiniCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Estado vacío ──────────────────────────────────────────────────────────

  it('should show empty state when items is empty', () => {
    const empty: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__empty');
    expect(empty).toBeTruthy();
  });

  it('should not show the items list when cart is empty', () => {
    const list: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__list');
    expect(list).toBeNull();
  });

  it('should not show the footer when cart is empty', () => {
    const footer: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__footer');
    expect(footer).toBeNull();
  });

  // ── Con artículos ─────────────────────────────────────────────────────────

  it('should hide empty state when items are provided', () => {
    fixture.componentRef.setInput('items', MOCK_ITEMS);
    fixture.detectChanges();
    const empty: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__empty');
    expect(empty).toBeNull();
  });

  it('should render one list item per cart item', () => {
    fixture.componentRef.setInput('items', MOCK_ITEMS);
    fixture.detectChanges();
    const rows: NodeList = fixture.nativeElement.querySelectorAll('.ts-mini-cart__item');
    expect(rows.length).toBe(2);
  });

  it('should render the product name', () => {
    fixture.componentRef.setInput('items', MOCK_ITEMS);
    fixture.detectChanges();
    const name: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__item-name');
    expect(name.textContent?.trim()).toBe('Tractor Pro 5000');
  });

  it('should render the variant info (color / size)', () => {
    fixture.componentRef.setInput('items', MOCK_ITEMS);
    fixture.detectChanges();
    const variant: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__item-variant');
    expect(variant.textContent?.trim()).toBe('Verde / L');
  });

  it('should render the total', () => {
    fixture.componentRef.setInput('items', MOCK_ITEMS);
    fixture.componentRef.setInput('total', 81000);
    fixture.detectChanges();
    const total: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__total-amount');
    expect(total.textContent?.trim()).toContain('81');
  });

  it('should display the item count in the header', () => {
    fixture.componentRef.setInput('items', MOCK_ITEMS);
    fixture.detectChanges();
    const count: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__count');
    expect(count.textContent?.trim()).toContain('2');
  });

  it('should use singular label for one item', () => {
    fixture.componentRef.setInput('items', [MOCK_ITEMS[0]]);
    fixture.detectChanges();
    const count: HTMLElement = fixture.nativeElement.querySelector('.ts-mini-cart__count');
    expect(count.textContent?.trim()).toContain('artículo');
    expect(count.textContent?.trim()).not.toContain('artículos');
  });

  // ── Emisión de itemRemoved ────────────────────────────────────────────────

  it('should emit itemRemoved with the item sku when remove button is clicked', () => {
    fixture.componentRef.setInput('items', MOCK_ITEMS);
    fixture.detectChanges();
    const spy = jest.spyOn(component.itemRemoved, 'emit');
    const removeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.ts-mini-cart__item-remove');
    removeBtn.click();
    expect(spy).toHaveBeenCalledWith('sku-001');
  });

  // ── Emisión de checkoutRequested ──────────────────────────────────────────

  it('should emit checkoutRequested when handleCheckout is called', () => {
    const spy = jest.spyOn(component.checkoutRequested, 'emit');
    component.handleCheckout();
    expect(spy).toHaveBeenCalled();
  });
});
