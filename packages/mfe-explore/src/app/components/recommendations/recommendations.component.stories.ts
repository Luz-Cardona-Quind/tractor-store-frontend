import type { Meta, StoryObj } from '@storybook/angular';
import { within, expect } from '@storybook/test';
import { RecommendationsComponent } from './recommendations.component';
import type { ProductSummary } from 'shared-catalog';

const MOCK_PRODUCTS: ProductSummary[] = [
  { id: 'p1', name: 'TractorMax 3000',    category: 'campo',      price: 45000, images: ['http://localhost:4201/assets/images/products/campo.svg'] },
  { id: 'p2', name: 'PowerBull X800',     category: 'industrial', price: 72000, images: ['http://localhost:4201/assets/images/products/industrial.svg'] },
  { id: 'p3', name: 'QuadTrack 200',      category: 'compacto',   price: 28000, images: ['http://localhost:4201/assets/images/products/compacto.svg'] },
  { id: 'p4', name: 'OrchardMaster 300',  category: 'huerto',     price: 19500, images: ['http://localhost:4201/assets/images/products/huerto.svg'] },
];

const meta: Meta<RecommendationsComponent> = {
  title: 'Explore/Recommendations',
  component: RecommendationsComponent,
  tags: ['autodocs'],
  argTypes: {
    productId: {
      control: 'text',
      description: 'Id del producto actual (para recomendaciones contextuales en mfe-decide)',
    },
    loading: {
      control: 'boolean',
      description: 'Muestra skeleton cards mientras carga',
    },
    products: {
      control: false,
      description: 'Lista de productos recomendados (viene del CatalogStore vía el padre)',
    },
  },
};

export default meta;
type Story = StoryObj<RecommendationsComponent>;

export const EstadoVacio: Story = {
  name: '1. Estado vacío (sin productos, sin carga)',
  args: { products: [], loading: false },
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector('.recommendations__track');
    await expect(track).toBeNull();
  },
};

export const Cargando: Story = {
  name: '2. Cargando (skeleton cards)',
  args: { products: [], loading: true },
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll('ts-product-card');
    await expect(cards.length).toBeGreaterThan(0);
    const track = canvasElement.querySelector('.recommendations__track');
    await expect(track).not.toBeNull();
  },
};

export const ConRecomendaciones: Story = {
  name: '3. Con recomendaciones (scroll horizontal)',
  args: { products: MOCK_PRODUCTS, loading: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const track = canvasElement.querySelector('.recommendations__track');
    await expect(track).not.toBeNull();

    const items = canvasElement.querySelectorAll('.recommendations__item');
    await expect(items.length).toBe(MOCK_PRODUCTS.length);

    await expect(canvas.getByText('TractorMax 3000')).toBeVisible();
    await expect(canvas.getByText('PowerBull X800')).toBeVisible();
  },
};

export const ConProductIdContextual: Story = {
  name: '4. Con productId (uso desde mfe-decide)',
  args: { products: MOCK_PRODUCTS, loading: false, productId: 'p1' },
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('.recommendations__item');
    await expect(items.length).toBe(MOCK_PRODUCTS.length);

    // El productId no altera el renderizado — es metadata contextual para el padre
    const track = canvasElement.querySelector('.recommendations__track');
    await expect(track).not.toBeNull();
  },
};
