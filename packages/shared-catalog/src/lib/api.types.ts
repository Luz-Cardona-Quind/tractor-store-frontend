import type { Category, Cart, LineItem, Product, ProductSummary, Store } from './models';

// ─── Shared ──────────────────────────────────────────────────────────────────

export interface FilterOption {
  key: string;
  label: string;
  values: string[];
}

export interface FilterState {
  category?: string;
  maxPrice?: number;
  color?: string;
  size?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// ─── Team Explore ─────────────────────────────────────────────────────────────

/** GET /explore/api/home */
export interface HomeResponse {
  categories: Category[];
  recommendations: ProductSummary[];
  stores: Store[];
}

/** GET /explore/api/category/:slug */
export interface CategoryResponse {
  category: Category;
  products: ProductSummary[];
  filters: FilterOption[];
  total: number;
}

/** GET /explore/api/stores */
export type StoresResponse = Store[];

/** GET /explore/api/recommendations?productId={productId} */
export type RecommendationsResponse = ProductSummary[];

// ─── Team Decide ──────────────────────────────────────────────────────────────

/** GET /decide/api/product/:id */
export interface ProductResponse {
  data: Product;
}

// ─── Team Checkout ────────────────────────────────────────────────────────────

/** GET /checkout/api/cart */
export interface CartResponse {
  cart: Cart;
}

/** POST /checkout/api/cart/items */
export interface AddItemRequest {
  item: LineItem;
}

/** DELETE /checkout/api/cart/items/:sku — response */
export type RemoveItemResponse = CartResponse;

/** POST /checkout/api/orders */
export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  storeId?: string;
}

/** POST /checkout/api/orders — response */
export interface OrderResponse {
  orderId: string;
  status: OrderStatus;
  items: LineItem[];
  total: number;
  createdAt: string;
}
