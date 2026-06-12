import type {
  Category,
  Variant,
  Product,
  ProductSummary,
  LineItem,
  Cart,
  Store,
  Result,
} from './models';

describe('Domain models', () => {
  describe('Variant', () => {
    it('constructs a valid variant', () => {
      const variant: Variant = {
        sku: 'TX-01-GN',
        color: 'Green',
        size: 'XL',
        stock: 5,
        price: 12000,
      };
      expect(variant.sku).toBe('TX-01-GN');
      expect(variant.stock).toBe(5);
    });
  });

  describe('Product', () => {
    it('constructs a valid product with variants', () => {
      const product: Product = {
        id: 'TX-01',
        name: 'TractorX 1000',
        category: 'field',
        price: 12000,
        images: ['https://cdn.example.com/tx-01.webp'],
        variants: [{ sku: 'TX-01-GN', color: 'Green', size: 'XL', stock: 3, price: 12000 }],
      };
      expect(product.variants).toHaveLength(1);
    });
  });

  describe('ProductSummary', () => {
    it('derives from Product omitting variants', () => {
      const summary: ProductSummary = {
        id: 'TX-01',
        name: 'TractorX 1000',
        category: 'field',
        price: 12000,
        images: [],
      };
      expect(summary).not.toHaveProperty('variants');
    });
  });

  describe('LineItem', () => {
    it('constructs a LineItem with quantity and product metadata', () => {
      const item: LineItem = {
        sku: 'TX-01-GN',
        color: 'Green',
        size: 'XL',
        price: 12000,
        quantity: 2,
        productId: 'TX-01',
        productName: 'TractorX 1000',
      };
      expect(item.quantity).toBe(2);
      expect(item.productId).toBe('TX-01');
    });
  });

  describe('Cart', () => {
    it('constructs an empty cart', () => {
      const cart: Cart = { id: 'cart-001', items: [] };
      expect(cart.items).toHaveLength(0);
    });

    it('constructs a cart with items', () => {
      const item: LineItem = {
        sku: 'TX-01-GN',
        color: 'Green',
        size: 'XL',
        price: 12000,
        quantity: 1,
        productId: 'TX-01',
        productName: 'TractorX 1000',
      };
      const cart: Cart = { id: 'cart-001', items: [item] };
      expect(cart.items).toHaveLength(1);
    });
  });

  describe('Store', () => {
    it('constructs a store with coordinates', () => {
      const store: Store = {
        id: 'store-01',
        name: 'Tractor Store Medellín',
        address: 'Calle 10 #20-30',
        coordinates: { lat: 6.2442, lng: -75.5812 },
      };
      expect(store.coordinates.lat).toBeCloseTo(6.2442);
    });
  });

  describe('Category', () => {
    it('constructs a valid category', () => {
      const category: Category = {
        id: 'cat-01',
        name: 'Field Tractors',
        slug: 'field',
        imageUrl: 'https://cdn.example.com/field.webp',
      };
      expect(category.slug).toBe('field');
    });
  });

  describe('Result<T>', () => {
    it('represents a successful result', () => {
      const result: Result<number> = { ok: true, data: 42 };
      if (result.ok) {
        expect(result.data).toBe(42);
      }
    });

    it('represents a failed result', () => {
      const result: Result<number> = { ok: false, error: new Error('not found') };
      if (!result.ok) {
        expect(result.error.message).toBe('not found');
      }
    });

    it('supports a custom error type', () => {
      type ApiError = { code: number; message: string };
      const result: Result<string, ApiError> = { ok: false, error: { code: 404, message: 'Not found' } };
      if (!result.ok) {
        expect(result.error.code).toBe(404);
      }
    });
  });
});
