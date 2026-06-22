import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartButtonComponent } from './cart-button.component';
import { CART_EVENTS } from 'shared-catalog';
import type { CartUpdatedPayload, LineItem } from 'shared-catalog';

const item = (sku: string, quantity: number): LineItem => ({
  sku,
  color: 'Rojo',
  size: 'M',
  price: 10000,
  quantity,
  productId: 'p1',
  productName: 'Tractor Rojo',
});

const dispatch = (payload: CartUpdatedPayload) =>
  document.dispatchEvent(
    new CustomEvent(CART_EVENTS.UPDATED, { bubbles: true, composed: true, detail: payload }),
  );

describe('CartButtonComponent', () => {
  let fixture: ComponentFixture<CartButtonComponent>;
  let component: CartButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the cart icon', () => {
    const icon = fixture.nativeElement.querySelector('.cart-button__icon');
    expect(icon).toBeTruthy();
  });

  it('should not show badge when cart is empty', () => {
    expect(fixture.nativeElement.querySelector('.cart-button__badge')).toBeNull();
  });

  it('should show badge with summed quantity when items are added', () => {
    dispatch({ items: [item('A', 2), item('B', 3)], total: 50000 });
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.cart-button__badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('5');
  });

  it('should cap badge at 99+', () => {
    dispatch({ items: [item('A', 100)], total: 1000000 });
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.cart-button__badge');
    expect(badge.textContent.trim()).toBe('99+');
  });

  it('should hide badge after cart is cleared', () => {
    dispatch({ items: [item('A', 1)], total: 10000 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cart-button__badge')).toBeTruthy();

    dispatch({ items: [], total: 0 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cart-button__badge')).toBeNull();
  });

  it('should update aria-label to reflect item count', () => {
    dispatch({ items: [item('A', 2)], total: 20000 });
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.cart-button');
    expect(btn.getAttribute('aria-label')).toContain('2');
  });
});
