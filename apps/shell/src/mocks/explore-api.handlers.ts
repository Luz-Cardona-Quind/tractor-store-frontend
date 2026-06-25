import { http, HttpResponse, delay } from 'msw';
import type { CategoryResponse, HomeResponse, RecommendationsResponse, StoresResponse } from 'shared-catalog';

const BASE = 'http://localhost:8080/explore/api';

type RouteParams = { slug: string };

const HOME: HomeResponse = {
  categories: [
    { id: 'cat-1', name: 'Tractores de Campo',     slug: 'campo',      imageUrl: 'http://localhost:4201/assets/images/categories/campo-tractor.webp' },
    { id: 'cat-2', name: 'Tractores Industriales', slug: 'industrial', imageUrl: 'http://localhost:4201/assets/images/categories/industrial-machinery.jpg' },
    { id: 'cat-3', name: 'Tractores Compactos',    slug: 'compacto',   imageUrl: 'http://localhost:4201/assets/images/categories/compact-tractor.jpg' },
    { id: 'cat-4', name: 'Tractores de Huerto',    slug: 'huerto',     imageUrl: 'http://localhost:4201/assets/images/categories/orchard-tractor.jpg' },
  ],
  recommendations: [
    { id: 'p-c1', name: 'TractorMax 3000',   category: 'campo',      price: 85_000, images: ['http://localhost:4201/assets/images/products/campo.svg'] },
    { id: 'p-i2', name: 'PowerBull X800',    category: 'industrial', price: 135_000, images: ['http://localhost:4201/assets/images/products/industrial.svg'] },
    { id: 'p-co3', name: 'QuadTrack 200',    category: 'compacto',   price: 32_000, images: ['http://localhost:4201/assets/images/products/compacto.svg'] },
    { id: 'p-h1', name: 'OrchardMaster 300', category: 'huerto',     price: 42_000, images: ['http://localhost:4201/assets/images/products/huerto.svg'] },
  ],
  stores: [
    { id: 'store-1', name: 'Tienda Central Bogotá', address: 'Av. El Dorado #68B-31, Bogotá', coordinates: { lat: 4.6512, lng: -74.1002 } },
    { id: 'store-2', name: 'Sucursal Medellín',     address: 'Cra. 43A #1 Sur-100, Medellín',  coordinates: { lat: 6.2442, lng: -75.5812 } },
    { id: 'store-3', name: 'Sucursal Cali',         address: 'Calle 5 #38-60, Cali',           coordinates: { lat: 3.4516, lng: -76.5320 } },
  ],
};

const STORES: StoresResponse = HOME.stores;

const RECOMMENDATIONS: RecommendationsResponse = HOME.recommendations;

const CATEGORIES: Record<string, CategoryResponse> = {
  campo: {
    category: HOME.categories[0],
    products: [
      { id: 'p-c1', name: 'TractorMax 3000',  category: 'campo', price: 85_000,  images: ['http://localhost:4201/assets/images/products/campo.svg'] },
      { id: 'p-c2', name: 'AgriPower X450',   category: 'campo', price: 62_000,  images: ['http://localhost:4201/assets/images/products/campo.svg'] },
      { id: 'p-c3', name: 'FieldPro 600',     category: 'campo', price: 120_000, images: ['http://localhost:4201/assets/images/products/campo.svg'] },
      { id: 'p-c4', name: 'CampoMaster 800',  category: 'campo', price: 145_000, images: ['http://localhost:4201/assets/images/products/campo.svg'] },
      { id: 'p-c5', name: 'TerraForce 250',   category: 'campo', price: 45_000,  images: ['http://localhost:4201/assets/images/products/campo.svg'] },
      { id: 'p-c6', name: 'AgriMax Turbo',    category: 'campo', price: 98_000,  images: ['http://localhost:4201/assets/images/products/campo.svg'] },
    ],
    filters: [],
    total: 6,
  },
  industrial: {
    category: HOME.categories[1],
    products: [
      { id: 'p-i1', name: 'InduMax 1200',     category: 'industrial', price: 180_000, images: ['http://localhost:4201/assets/images/products/industrial.svg'] },
      { id: 'p-i2', name: 'PowerBull X800',   category: 'industrial', price: 135_000, images: ['http://localhost:4201/assets/images/products/industrial.svg'] },
      { id: 'p-i3', name: 'HeavyDuty Pro',    category: 'industrial', price: 220_000, images: ['http://localhost:4201/assets/images/products/industrial.svg'] },
      { id: 'p-i4', name: 'IndusForce 2000',  category: 'industrial', price: 250_000, images: ['http://localhost:4201/assets/images/products/industrial.svg'] },
      { id: 'p-i5', name: 'WorkMaster 600',   category: 'industrial', price: 95_000,  images: ['http://localhost:4201/assets/images/products/industrial.svg'] },
    ],
    filters: [],
    total: 5,
  },
  compacto: {
    category: HOME.categories[2],
    products: [
      { id: 'p-co1', name: 'MiniMax 120',    category: 'compacto', price: 18_000, images: ['http://localhost:4201/assets/images/products/compacto.svg'] },
      { id: 'p-co2', name: 'CompactPro 180', category: 'compacto', price: 24_000, images: ['http://localhost:4201/assets/images/products/compacto.svg'] },
      { id: 'p-co3', name: 'QuadTrack 200',  category: 'compacto', price: 32_000, images: ['http://localhost:4201/assets/images/products/compacto.svg'] },
      { id: 'p-co4', name: 'MicroField 150', category: 'compacto', price: 21_000, images: ['http://localhost:4201/assets/images/products/compacto.svg'] },
      { id: 'p-co5', name: 'SlimPower 90',   category: 'compacto', price: 14_000, images: ['http://localhost:4201/assets/images/products/compacto.svg'] },
    ],
    filters: [],
    total: 5,
  },
  huerto: {
    category: HOME.categories[3],
    products: [
      { id: 'p-h1', name: 'OrchardMaster 300', category: 'huerto', price: 42_000, images: ['http://localhost:4201/assets/images/products/huerto.svg'] },
      { id: 'p-h2', name: 'FruitPro X200',     category: 'huerto', price: 35_000, images: ['http://localhost:4201/assets/images/products/huerto.svg'] },
      { id: 'p-h3', name: 'GardenForce 150',   category: 'huerto', price: 28_000, images: ['http://localhost:4201/assets/images/products/huerto.svg'] },
      { id: 'p-h4', name: 'HuertoMax 250',     category: 'huerto', price: 38_000, images: ['http://localhost:4201/assets/images/products/huerto.svg'] },
      { id: 'p-h5', name: 'PickFarm 180',      category: 'huerto', price: 31_000, images: ['http://localhost:4201/assets/images/products/huerto.svg'] },
    ],
    filters: [],
    total: 5,
  },
};

export const exploreHandlers = [
  http.get(`${BASE}/home`, async () => {
    await delay(500);
    return HttpResponse.json(HOME);
  }),

  http.get<RouteParams>(`${BASE}/category/:slug`, async ({ params }) => {
    await delay(500);
    const data = CATEGORIES[params.slug];
    if (!data) {
      return HttpResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/stores`, async () => {
    await delay(500);
    return HttpResponse.json(STORES);
  }),

  http.get(`${BASE}/recommendations`, async ({ request }) => {
    await delay(500);
    const productId = new URL(request.url).searchParams.get('productId');
    const filtered = productId
      ? RECOMMENDATIONS.filter((p) => p.id !== productId)
      : RECOMMENDATIONS;
    return HttpResponse.json(filtered);
  }),
];
