export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface Variant {
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  variants: Readonly<Variant[]>;
}

export type ProductSummary = Pick<Product, 'id' | 'name' | 'category' | 'price' | 'images'>;

export type LineItem = Pick<Variant, 'sku' | 'color' | 'size' | 'price'> & {
  quantity: number;
  productId: string;
  productName: string;
};

export interface Cart {
  id: string;
  items: LineItem[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export interface AppError {
  /** Mensaje en español orientado al usuario final. */
  message: string;
  /** Código HTTP de origen, si aplica. */
  statusCode?: number;
}
