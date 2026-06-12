import type {
  HomeResponse,
  CategoryResponse,
  ProductResponse,
  CartResponse,
  OrderResponse,
  OrderFormData,
  FilterOption,
  FilterState,
  StoresResponse,
  AddItemRequest,
} from './api.types';
import type { Category, Product, ProductSummary, Store, Cart, LineItem } from './models';

const category: Category = { id: 'cat-1', name: 'Field', slug: 'field', imageUrl: 'img.webp' };
const store: Store = { id: 'st-1', name: 'Medellín', address: 'Calle 10', coordinates: { lat: 6.24, lng: -75.58 } };
const variant = { sku: 'TX-01-GN', color: 'Green', size: 'XL', stock: 3, price: 12000 };
const product: Product = { id: 'TX-01', name: 'TractorX', category: 'field', price: 12000, images: [], variants: [variant] };
const summary: ProductSummary = { id: 'TX-01', name: 'TractorX', category: 'field', price: 12000, images: [] };
const lineItem: LineItem = { sku: 'TX-01-GN', color: 'Green', size: 'XL', price: 12000, quantity: 1, productId: 'TX-01', productName: 'TractorX' };
const cart: Cart = { id: 'cart-1', items: [lineItem] };

describe('API response types', () => {
  describe('HomeResponse', () => {
    it('has categories, recommendations and stores', () => {
      const response: HomeResponse = { categories: [category], recommendations: [summary], stores: [store] };
      expect(response.categories).toHaveLength(1);
      expect(response.recommendations).toHaveLength(1);
      expect(response.stores).toHaveLength(1);
    });
  });

  describe('CategoryResponse', () => {
    it('has category, products, filters and total', () => {
      const filter: FilterOption = { key: 'color', label: 'Color', values: ['Green', 'Red'] };
      const response: CategoryResponse = { category, products: [summary], filters: [filter], total: 1 };
      expect(response.total).toBe(1);
      expect(response.filters[0].values).toContain('Green');
    });
  });

  describe('FilterState', () => {
    it('allows partial filter state', () => {
      const state: FilterState = { maxPrice: 15000 };
      expect(state.maxPrice).toBe(15000);
      expect(state.color).toBeUndefined();
    });
  });

  describe('StoresResponse', () => {
    it('is an array of stores', () => {
      const response: StoresResponse = [store];
      expect(response).toHaveLength(1);
    });
  });

  describe('ProductResponse', () => {
    it('wraps a full product in data', () => {
      const response: ProductResponse = { data: product };
      expect(response.data.variants).toHaveLength(1);
    });
  });

  describe('CartResponse', () => {
    it('wraps a cart', () => {
      const response: CartResponse = { cart };
      expect(response.cart.items).toHaveLength(1);
    });
  });

  describe('AddItemRequest', () => {
    it('carries a line item', () => {
      const request: AddItemRequest = { item: lineItem };
      expect(request.item.sku).toBe('TX-01-GN');
    });
  });

  describe('OrderFormData', () => {
    it('contains all required shipping fields', () => {
      const form: OrderFormData = {
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana@example.com',
        address: 'Calle 10 #20-30',
        city: 'Medellín',
        postalCode: '050001',
        phone: '3001234567',
      };
      expect(form.storeId).toBeUndefined();
      expect(form.email).toContain('@');
    });

    it('accepts an optional storeId for in-store pickup', () => {
      const form: OrderFormData = {
        firstName: 'Luis',
        lastName: 'Pérez',
        email: 'luis@example.com',
        address: 'Av. 80 #5-10',
        city: 'Bogotá',
        postalCode: '110001',
        phone: '3119876543',
        storeId: 'st-1',
      };
      expect(form.storeId).toBe('st-1');
    });
  });

  describe('OrderResponse', () => {
    it('has orderId, status, items, total and createdAt', () => {
      const response: OrderResponse = {
        orderId: 'ORD-001',
        status: 'confirmed',
        items: [lineItem],
        total: 12000,
        createdAt: '2026-06-12T10:00:00Z',
      };
      expect(response.orderId).toBe('ORD-001');
      expect(response.status).toBe('confirmed');
    });

    it('accepts all valid order statuses', () => {
      const statuses: OrderResponse['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      statuses.forEach((status) => {
        const r: OrderResponse = { orderId: 'x', status, items: [], total: 0, createdAt: '' };
        expect(r.status).toBe(status);
      });
    });
  });
});
