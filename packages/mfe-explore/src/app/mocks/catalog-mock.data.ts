import type { Category, ProductSummary, Store } from 'shared-catalog';
import type { CategoryResponse, HomeResponse } from 'shared-catalog';
import { environment } from '../../environments/environment';

const BASE = environment.publicUrl;
const CAT_IMG  = (slug: string) => `${BASE}/assets/images/categories/${slug}`;
const PROD_IMG = (category: string) => `${BASE}/assets/images/products/${category}.svg`;

// ─── Categorías ───────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Tractores de Campo',       slug: 'campo',      imageUrl: CAT_IMG('campo-tractor.webp') },
  { id: 'cat-2', name: 'Tractores Industriales',   slug: 'industrial', imageUrl: CAT_IMG('industrial-machinery.jpg') },
  { id: 'cat-3', name: 'Tractores Compactos',      slug: 'compacto',   imageUrl: CAT_IMG('compact-tractor.jpg') },
  { id: 'cat-4', name: 'Tractores de Huerto',      slug: 'huerto',     imageUrl: CAT_IMG('orchard-tractor.jpg') },
];

// ─── Productos por categoría ──────────────────────────────────────────────────

const CAMPO: ProductSummary[] = [
  { id: 'p-c1', name: 'TractorMax 3000',   category: 'campo', price: 85_000,  images: [PROD_IMG('campo')] },
  { id: 'p-c2', name: 'AgriPower X450',    category: 'campo', price: 62_000,  images: [PROD_IMG('campo')] },
  { id: 'p-c3', name: 'FieldPro 600',      category: 'campo', price: 120_000, images: [PROD_IMG('campo')] },
  { id: 'p-c4', name: 'CampoMaster 800',   category: 'campo', price: 145_000, images: [PROD_IMG('campo')] },
  { id: 'p-c5', name: 'TerraForce 250',    category: 'campo', price: 45_000,  images: [PROD_IMG('campo')] },
  { id: 'p-c6', name: 'AgriMax Turbo',     category: 'campo', price: 98_000,  images: [PROD_IMG('campo')] },
];

const INDUSTRIAL: ProductSummary[] = [
  { id: 'p-i1', name: 'InduMax 1200',      category: 'industrial', price: 180_000, images: [PROD_IMG('industrial')] },
  { id: 'p-i2', name: 'PowerBull X800',    category: 'industrial', price: 135_000, images: [PROD_IMG('industrial')] },
  { id: 'p-i3', name: 'HeavyDuty Pro',     category: 'industrial', price: 220_000, images: [PROD_IMG('industrial')] },
  { id: 'p-i4', name: 'IndusForce 2000',   category: 'industrial', price: 250_000, images: [PROD_IMG('industrial')] },
  { id: 'p-i5', name: 'WorkMaster 600',    category: 'industrial', price: 95_000,  images: [PROD_IMG('industrial')] },
];

const COMPACTO: ProductSummary[] = [
  { id: 'p-co1', name: 'MiniMax 120',      category: 'compacto', price: 18_000, images: [PROD_IMG('compacto')] },
  { id: 'p-co2', name: 'CompactPro 180',   category: 'compacto', price: 24_000, images: [PROD_IMG('compacto')] },
  { id: 'p-co3', name: 'QuadTrack 200',    category: 'compacto', price: 32_000, images: [PROD_IMG('compacto')] },
  { id: 'p-co4', name: 'MicroField 150',   category: 'compacto', price: 21_000, images: [PROD_IMG('compacto')] },
  { id: 'p-co5', name: 'SlimPower 90',     category: 'compacto', price: 14_000, images: [PROD_IMG('compacto')] },
];

const HUERTO: ProductSummary[] = [
  { id: 'p-h1', name: 'OrchardMaster 300', category: 'huerto', price: 42_000, images: [PROD_IMG('huerto')] },
  { id: 'p-h2', name: 'FruitPro X200',     category: 'huerto', price: 35_000, images: [PROD_IMG('huerto')] },
  { id: 'p-h3', name: 'GardenForce 150',   category: 'huerto', price: 28_000, images: [PROD_IMG('huerto')] },
  { id: 'p-h4', name: 'HuertoMax 250',     category: 'huerto', price: 38_000, images: [PROD_IMG('huerto')] },
  { id: 'p-h5', name: 'PickFarm 180',      category: 'huerto', price: 31_000, images: [PROD_IMG('huerto')] },
];

const PRODUCTS_BY_SLUG: Readonly<Record<string, ProductSummary[]>> = {
  campo:      CAMPO,
  industrial: INDUSTRIAL,
  compacto:   COMPACTO,
  huerto:     HUERTO,
};

// ─── Tiendas ──────────────────────────────────────────────────────────────────

export const MOCK_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Tienda Central Bogotá',
    address: 'Av. El Dorado #68B-31, Bogotá',
    coordinates: { lat: 4.6512, lng: -74.1002 },
  },
  {
    id: 'store-2',
    name: 'Sucursal Medellín',
    address: 'Cra. 43A #1 Sur-100, Medellín',
    coordinates: { lat: 6.2442, lng: -75.5812 },
  },
  {
    id: 'store-3',
    name: 'Sucursal Cali',
    address: 'Calle 5 #38-60, Cali',
    coordinates: { lat: 3.4516, lng: -76.5320 },
  },
];

// ─── Recomendaciones (mix de categorías) ─────────────────────────────────────

export const MOCK_RECOMMENDATIONS: ProductSummary[] = [
  CAMPO[0],      // TractorMax 3000
  INDUSTRIAL[1], // PowerBull X800
  COMPACTO[2],   // QuadTrack 200
  HUERTO[0],     // OrchardMaster 300
  CAMPO[4],      // TerraForce 250
];

// ─── Helpers para construir respuestas tipadas ────────────────────────────────

export function getMockHomeResponse(): HomeResponse {
  return {
    categories: MOCK_CATEGORIES,
    recommendations: MOCK_RECOMMENDATIONS,
    stores: MOCK_STORES,
  };
}

export function getMockCategoryResponse(slug: string): CategoryResponse | null {
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  const products = PRODUCTS_BY_SLUG[slug];
  if (!category || !products) return null;
  return { category, products, filters: [], total: products.length };
}

/**
 * Devuelve el listado de tiendas para el endpoint GET /stores.
 * @returns Array de tiendas físicas disponibles.
 */
export function getMockStoresResponse(): Store[] {
  return MOCK_STORES;
}

/**
 * Devuelve recomendaciones de productos, excluyendo el producto actual si se proporciona.
 * @param productId Id del producto actual a excluir de las recomendaciones.
 * @returns Array de productos recomendados.
 */
export function getMockRecommendationsResponse(productId?: string): ProductSummary[] {
  if (!productId) return MOCK_RECOMMENDATIONS;
  return MOCK_RECOMMENDATIONS.filter((p) => p.id !== productId);
}
