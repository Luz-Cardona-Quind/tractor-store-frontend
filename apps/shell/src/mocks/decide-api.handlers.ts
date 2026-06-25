import { http, HttpResponse, delay } from 'msw';
import type { ProductResponse } from 'shared-catalog';

const BASE = 'http://localhost:8080/decide/api';

const PRODUCTS: Record<string, ProductResponse> = {
  'p-c1': {
    data: {
      id: 'p-c1',
      name: 'TractorMax 3000',
      category: 'campo',
      price: 85_000,
      images: [
        'http://localhost:4201/assets/images/products/campo.svg',
        'http://localhost:4201/assets/images/products/campo.svg',
      ],
      variants: [
        { sku: 'p-c1-verde-g',  color: 'Verde',  size: 'Grande',  stock: 5, price: 85_000 },
        { sku: 'p-c1-verde-m',  color: 'Verde',  size: 'Mediano', stock: 3, price: 80_000 },
        { sku: 'p-c1-azul-g',   color: 'Azul',   size: 'Grande',  stock: 0, price: 87_000 },
        { sku: 'p-c1-rojo-m',   color: 'Rojo',   size: 'Mediano', stock: 2, price: 82_000 },
      ],
    },
  },
  'p-c2': {
    data: {
      id: 'p-c2',
      name: 'AgriPower X450',
      category: 'campo',
      price: 62_000,
      images: ['http://localhost:4201/assets/images/products/campo.svg'],
      variants: [
        { sku: 'p-c2-verde-g',  color: 'Verde',  size: 'Grande',  stock: 8, price: 62_000 },
        { sku: 'p-c2-amarillo-g', color: 'Amarillo', size: 'Grande', stock: 0, price: 64_000 },
      ],
    },
  },
  'p-c3': {
    data: {
      id: 'p-c3',
      name: 'FieldPro 600',
      category: 'campo',
      price: 120_000,
      images: ['http://localhost:4201/assets/images/products/campo.svg'],
      variants: [
        { sku: 'p-c3-negro-xl', color: 'Negro',  size: 'XL',      stock: 2, price: 120_000 },
        { sku: 'p-c3-negro-g',  color: 'Negro',  size: 'Grande',  stock: 1, price: 115_000 },
        { sku: 'p-c3-gris-xl',  color: 'Gris',   size: 'XL',      stock: 0, price: 122_000 },
      ],
    },
  },
  'p-c4': {
    data: {
      id: 'p-c4',
      name: 'CampoMaster 800',
      category: 'campo',
      price: 145_000,
      images: ['http://localhost:4201/assets/images/products/campo.svg'],
      variants: [
        { sku: 'p-c4-verde-xl', color: 'Verde',  size: 'XL',      stock: 3, price: 145_000 },
        { sku: 'p-c4-azul-xl',  color: 'Azul',   size: 'XL',      stock: 1, price: 148_000 },
      ],
    },
  },
  'p-c5': {
    data: {
      id: 'p-c5',
      name: 'TerraForce 250',
      category: 'campo',
      price: 45_000,
      images: ['http://localhost:4201/assets/images/products/campo.svg'],
      variants: [
        { sku: 'p-c5-amarillo-m', color: 'Amarillo', size: 'Mediano', stock: 6, price: 45_000 },
        { sku: 'p-c5-rojo-m',     color: 'Rojo',     size: 'Mediano', stock: 0, price: 47_000 },
      ],
    },
  },
  'p-c6': {
    data: {
      id: 'p-c6',
      name: 'AgriMax Turbo',
      category: 'campo',
      price: 98_000,
      images: ['http://localhost:4201/assets/images/products/campo.svg'],
      variants: [
        { sku: 'p-c6-verde-g',  color: 'Verde',  size: 'Grande',  stock: 4, price: 98_000 },
        { sku: 'p-c6-negro-g',  color: 'Negro',  size: 'Grande',  stock: 2, price: 100_000 },
        { sku: 'p-c6-verde-xl', color: 'Verde',  size: 'XL',      stock: 0, price: 103_000 },
      ],
    },
  },
  'p-i1': {
    data: {
      id: 'p-i1',
      name: 'InduMax 1200',
      category: 'industrial',
      price: 180_000,
      images: ['http://localhost:4201/assets/images/products/industrial.svg'],
      variants: [
        { sku: 'p-i1-naranja-xl', color: 'Naranja', size: 'XL',     stock: 3, price: 180_000 },
        { sku: 'p-i1-naranja-g',  color: 'Naranja', size: 'Grande', stock: 0, price: 175_000 },
      ],
    },
  },
  'p-i2': {
    data: {
      id: 'p-i2',
      name: 'PowerBull X800',
      category: 'industrial',
      price: 135_000,
      images: ['http://localhost:4201/assets/images/products/industrial.svg'],
      variants: [
        { sku: 'p-i2-rojo-xl',     color: 'Rojo',     size: 'XL',     stock: 4, price: 135_000 },
        { sku: 'p-i2-rojo-g',      color: 'Rojo',     size: 'Grande', stock: 2, price: 130_000 },
        { sku: 'p-i2-amarillo-xl', color: 'Amarillo', size: 'XL',     stock: 0, price: 138_000 },
      ],
    },
  },
  'p-i3': {
    data: {
      id: 'p-i3',
      name: 'HeavyDuty Pro',
      category: 'industrial',
      price: 220_000,
      images: ['http://localhost:4201/assets/images/products/industrial.svg'],
      variants: [
        { sku: 'p-i3-naranja-xl', color: 'Naranja', size: 'XL',     stock: 2, price: 220_000 },
        { sku: 'p-i3-negro-xl',   color: 'Negro',   size: 'XL',     stock: 1, price: 225_000 },
      ],
    },
  },
  'p-i4': {
    data: {
      id: 'p-i4',
      name: 'IndusForce 2000',
      category: 'industrial',
      price: 250_000,
      images: ['http://localhost:4201/assets/images/products/industrial.svg'],
      variants: [
        { sku: 'p-i4-amarillo-xl', color: 'Amarillo', size: 'XL', stock: 1, price: 250_000 },
        { sku: 'p-i4-rojo-xl',     color: 'Rojo',     size: 'XL', stock: 0, price: 255_000 },
      ],
    },
  },
  'p-i5': {
    data: {
      id: 'p-i5',
      name: 'WorkMaster 600',
      category: 'industrial',
      price: 95_000,
      images: ['http://localhost:4201/assets/images/products/industrial.svg'],
      variants: [
        { sku: 'p-i5-gris-g',  color: 'Gris',  size: 'Grande',  stock: 5, price: 95_000 },
        { sku: 'p-i5-negro-g', color: 'Negro', size: 'Grande',  stock: 3, price: 97_000 },
      ],
    },
  },
  'p-co1': {
    data: {
      id: 'p-co1',
      name: 'MiniMax 120',
      category: 'compacto',
      price: 18_000,
      images: ['http://localhost:4201/assets/images/products/compacto.svg'],
      variants: [
        { sku: 'p-co1-verde-p',  color: 'Verde',  size: 'Pequeño', stock: 10, price: 18_000 },
        { sku: 'p-co1-azul-p',   color: 'Azul',   size: 'Pequeño', stock: 5,  price: 19_000 },
      ],
    },
  },
  'p-co2': {
    data: {
      id: 'p-co2',
      name: 'CompactPro 180',
      category: 'compacto',
      price: 24_000,
      images: ['http://localhost:4201/assets/images/products/compacto.svg'],
      variants: [
        { sku: 'p-co2-azul-p',  color: 'Azul',  size: 'Pequeño', stock: 7, price: 24_000 },
        { sku: 'p-co2-verde-p', color: 'Verde', size: 'Pequeño', stock: 2, price: 25_000 },
      ],
    },
  },
  'p-co3': {
    data: {
      id: 'p-co3',
      name: 'QuadTrack 200',
      category: 'compacto',
      price: 32_000,
      images: ['http://localhost:4201/assets/images/products/compacto.svg'],
      variants: [
        { sku: 'p-co3-gris-m',  color: 'Gris',  size: 'Mediano', stock: 6, price: 32_000 },
        { sku: 'p-co3-negro-m', color: 'Negro', size: 'Mediano', stock: 0, price: 33_000 },
      ],
    },
  },
  'p-co4': {
    data: {
      id: 'p-co4',
      name: 'MicroField 150',
      category: 'compacto',
      price: 21_000,
      images: ['http://localhost:4201/assets/images/products/compacto.svg'],
      variants: [
        { sku: 'p-co4-rojo-p',   color: 'Rojo',   size: 'Pequeño', stock: 4, price: 21_000 },
        { sku: 'p-co4-blanco-p', color: 'Blanco', size: 'Pequeño', stock: 0, price: 22_000 },
      ],
    },
  },
  'p-co5': {
    data: {
      id: 'p-co5',
      name: 'SlimPower 90',
      category: 'compacto',
      price: 14_000,
      images: ['http://localhost:4201/assets/images/products/compacto.svg'],
      variants: [
        { sku: 'p-co5-gris-p',  color: 'Gris',  size: 'Pequeño', stock: 9, price: 14_000 },
        { sku: 'p-co5-azul-p',  color: 'Azul',  size: 'Pequeño', stock: 3, price: 15_000 },
      ],
    },
  },
  'p-h1': {
    data: {
      id: 'p-h1',
      name: 'OrchardMaster 300',
      category: 'huerto',
      price: 42_000,
      images: ['http://localhost:4201/assets/images/products/huerto.svg'],
      variants: [
        { sku: 'p-h1-verde-m',   color: 'Verde',  size: 'Mediano', stock: 7, price: 42_000 },
        { sku: 'p-h1-amarillo-m', color: 'Amarillo', size: 'Mediano', stock: 3, price: 44_000 },
        { sku: 'p-h1-verde-p',   color: 'Verde',  size: 'Pequeño', stock: 0, price: 40_000 },
      ],
    },
  },
  'p-h2': {
    data: {
      id: 'p-h2',
      name: 'FruitPro X200',
      category: 'huerto',
      price: 35_000,
      images: ['http://localhost:4201/assets/images/products/huerto.svg'],
      variants: [
        { sku: 'p-h2-verde-p',   color: 'Verde',   size: 'Pequeño', stock: 4, price: 35_000 },
        { sku: 'p-h2-naranja-p', color: 'Naranja', size: 'Pequeño', stock: 2, price: 36_000 },
      ],
    },
  },
  'p-h3': {
    data: {
      id: 'p-h3',
      name: 'GardenForce 150',
      category: 'huerto',
      price: 28_000,
      images: ['http://localhost:4201/assets/images/products/huerto.svg'],
      variants: [
        { sku: 'p-h3-verde-p',    color: 'Verde',    size: 'Pequeño', stock: 5, price: 28_000 },
        { sku: 'p-h3-amarillo-p', color: 'Amarillo', size: 'Pequeño', stock: 0, price: 29_000 },
      ],
    },
  },
  'p-h4': {
    data: {
      id: 'p-h4',
      name: 'HuertoMax 250',
      category: 'huerto',
      price: 38_000,
      images: ['http://localhost:4201/assets/images/products/huerto.svg'],
      variants: [
        { sku: 'p-h4-rojo-m',  color: 'Rojo',  size: 'Mediano', stock: 3, price: 38_000 },
        { sku: 'p-h4-verde-m', color: 'Verde', size: 'Mediano', stock: 2, price: 39_000 },
      ],
    },
  },
  'p-h5': {
    data: {
      id: 'p-h5',
      name: 'PickFarm 180',
      category: 'huerto',
      price: 31_000,
      images: ['http://localhost:4201/assets/images/products/huerto.svg'],
      variants: [
        { sku: 'p-h5-naranja-p', color: 'Naranja', size: 'Pequeño', stock: 6, price: 31_000 },
        { sku: 'p-h5-verde-p',   color: 'Verde',   size: 'Pequeño', stock: 1, price: 32_000 },
      ],
    },
  },
};

export const decideHandlers = [
  http.get(`${BASE}/product/:id`, async ({ params }) => {
    await delay(300);
    const product = PRODUCTS[params['id'] as string];
    if (!product) {
      return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }
    return HttpResponse.json(product);
  }),
];
