import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DECIDE_API_URL } from 'shared-catalog';
import type { Product } from 'shared-catalog';
import { ProductComponent } from './product.component';
import { ProductStore } from '../../store/product.store';
import { ProductActions } from '../../store/product.actions';
import { ProductSelectors } from '../../store/product.selectors';
import { ProductFacadeService } from '../../store/product.facade';
import { ProductService } from '../../services/product.service';

const MOCK_PRODUCT: Product = {
  id: 'p-1',
  name: 'TractorMax 3000',
  category: 'campo',
  price: 85_000,
  images: ['/img/campo.svg', '/img/campo-2.svg'],
  variants: [
    { sku: 'SKU-A', color: 'Verde', size: 'Grande',  stock: 5, price: 85_000 },
    { sku: 'SKU-B', color: 'Rojo',  size: 'Mediano', stock: 0, price: 80_000 },
  ],
};

function makeActivatedRoute(product?: Product) {
  return {
    snapshot: {
      paramMap: convertToParamMap({ id: 'p-1' }),
      data: product ? { product } : {},
    },
  };
}

function setup(product?: Product) {
  TestBed.configureTestingModule({
    imports: [ProductComponent],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: DECIDE_API_URL, useValue: 'http://localhost:8080/decide/api' },
      { provide: ActivatedRoute, useValue: makeActivatedRoute(product) },
      ProductStore,
      ProductSelectors,
      ProductActions,
      ProductFacadeService,
      ProductService,
    ],
  });

  const fixture: ComponentFixture<ProductComponent> = TestBed.createComponent(ProductComponent);
  fixture.detectChanges();
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('ProductComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('carga exitosa (producto desde resolver)', () => {
    it('should render product name', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(el.querySelector('.decide-product__name')?.textContent).toContain('TractorMax 3000');
    });

    it('should render product price', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(el.querySelector('.decide-product__price')?.textContent).toContain('85');
    });

    it('should render variant options', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();
      const variants = el.querySelectorAll('ts-variant-option');
      expect(variants.length).toBe(2);
    });

    it('should render main image', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();
      const img = el.querySelector('.decide-product__main-image') as HTMLImageElement;
      expect(img).not.toBeNull();
      expect(img.src).toContain('campo.svg');
    });

    it('should render thumbnails when product has multiple images', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();
      const thumbs = el.querySelectorAll('.decide-product__thumb-btn');
      expect(thumbs.length).toBe(2);
    });

    it('should auto-select first variant with stock', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();
      // SKU-A tiene stock; el botón interno de ts-button debe estar habilitado
      const addBtn = el.querySelector('.decide-product__add-btn button') as HTMLButtonElement;
      expect(addBtn.disabled).toBe(false);
    });

    it('should show "Añadir al carrito" when variant has stock', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(el.querySelector('.decide-product__add-btn')?.textContent?.trim())
        .toBe('Añadir al carrito');
    });
  });

  describe('variant selection', () => {
    it('should disable add button when out-of-stock variant is active', async () => {
      const noStockProduct: Product = {
        ...MOCK_PRODUCT,
        variants: [{ sku: 'SKU-X', color: 'Gris', size: 'Único', stock: 0, price: 70_000 }],
      };
      const { fixture, el } = setup(noStockProduct);
      await fixture.whenStable();
      fixture.detectChanges();
      const addBtn = el.querySelector('.decide-product__add-btn button') as HTMLButtonElement;
      expect(addBtn.disabled).toBe(true);
    });

    it('should show "Sin stock" label when selected variant is out of stock', async () => {
      const noStockProduct: Product = {
        ...MOCK_PRODUCT,
        variants: [{ sku: 'SKU-X', color: 'Gris', size: 'Único', stock: 0, price: 70_000 }],
      };
      const { fixture, el } = setup(noStockProduct);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(el.querySelector('.decide-product__add-btn')?.textContent?.trim())
        .toBe('Sin stock');
    });
  });

  describe('addToCart()', () => {
    it('should dispatch checkout:cart-item-added event when clicking add button', async () => {
      const { fixture, el } = setup(MOCK_PRODUCT);
      await fixture.whenStable();
      fixture.detectChanges();

      const events: Event[] = [];
      document.addEventListener('checkout:cart-item-added', (e) => events.push(e));

      const addBtn = el.querySelector('.decide-product__add-btn button') as HTMLButtonElement;
      addBtn.click();

      expect(events.length).toBe(1);
      const payload = (events[0] as CustomEvent).detail;
      expect(payload.item.productId).toBe('p-1');
      expect(payload.item.quantity).toBe(1);

      document.removeEventListener('checkout:cart-item-added', (e) => events.push(e));
    });
  });

  describe('loading state (sin resolver data)', () => {
    it('should show skeleton while loading when no resolver data', async () => {
      // No se pasa product → el componente llama loadProduct() pero no hay http mock
      // El estado inicial de loading=true se refleja en el template
      const { fixture, el } = setup();
      // Justo después del ngOnInit loading=true
      fixture.detectChanges();
      // El skeleton aparece mientras carga (sin data del resolver)
      // Como el HttpTestingController no responde, loading queda en true
      const skeleton = el.querySelector('.decide-product__skeleton');
      expect(skeleton).not.toBeNull();
    });
  });
});
