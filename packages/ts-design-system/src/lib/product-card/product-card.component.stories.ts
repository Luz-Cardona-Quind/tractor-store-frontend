import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from '@storybook/test';
import { TsProductCardComponent } from './product-card.component';
import { ProductSummary } from 'shared-catalog';

const SAMPLE_PRODUCT: ProductSummary = {
  id: 'prod-1',
  name: 'Tractor Pro 5000',
  category: 'tractors',
  price: 45000,
  images: ['https://picsum.photos/seed/tractor/400/300'],
};

const PRODUCT_NO_IMAGE: ProductSummary = {
  ...SAMPLE_PRODUCT,
  id: 'prod-2',
  name: 'Tractor Basic 2000',
  price: 18000,
  images: [],
};

const meta: Meta<TsProductCardComponent> = {
  title: 'Design System/ProductCard',
  component: TsProductCardComponent,
  tags: ['autodocs'],
  argTypes: {
    product: { control: 'object', description: 'Datos del producto (ProductSummary)' },
    showPrice: { control: 'boolean', description: 'Muestra u oculta el precio' },
    loading: { control: 'boolean', description: 'Estado skeleton de carga' },
    productSelected: { action: 'productSelected' },
  },
  args: {
    product: SAMPLE_PRODUCT,
    showPrice: true,
    loading: false,
    productSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: `<ts-product-card ${argsToTemplate(args)} style="max-width:280px;display:block"></ts-product-card>`,
  }),
};

export default meta;
type Story = StoryObj<TsProductCardComponent>;

export const Default: Story = {};

export const SinPrecio: Story = {
  name: 'Sin precio',
  args: { showPrice: false },
};

export const SinImagen: Story = {
  name: 'Sin imagen (fallback)',
  args: { product: PRODUCT_NO_IMAGE },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Grid: Story = {
  name: 'Grid de productos',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:grid; grid-template-columns:repeat(3,280px); gap:var(--space-6);">
        <ts-product-card
          [product]="products[0]"
          [showPrice]="true">
        </ts-product-card>
        <ts-product-card
          [product]="products[1]"
          [showPrice]="true">
        </ts-product-card>
        <ts-product-card
          [product]="products[0]"
          [loading]="true">
        </ts-product-card>
      </div>
    `,
    props: {
      products: [
        SAMPLE_PRODUCT,
        PRODUCT_NO_IMAGE,
      ],
    },
  }),
};
