import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import type { LineItem } from 'shared-catalog';
import { TsMiniCartComponent } from './mini-cart.component';

const SAMPLE_ITEMS: LineItem[] = [
  {
    sku: 'sku-001',
    productId: 'prod-1',
    productName: 'Tractor Pro 5000',
    color: 'Verde',
    size: 'L',
    price: 45000,
    quantity: 1,
  },
  {
    sku: 'sku-002',
    productId: 'prod-2',
    productName: 'Tractor Basic 2000',
    color: 'Rojo',
    size: 'M',
    price: 18000,
    quantity: 2,
  },
];

const meta: Meta<TsMiniCartComponent> = {
  title: 'Design System/MiniCart',
  component: TsMiniCartComponent,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object', description: 'Artículos en el carrito (LineItem[])' },
    total: { control: 'number', description: 'Total calculado del carrito' },
    checkoutRequested: { action: 'checkoutRequested' },
    itemRemoved: { action: 'itemRemoved' },
  },
  args: {
    items: SAMPLE_ITEMS,
    total: 81000,
    checkoutRequested: fn(),
    itemRemoved: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <ts-mini-cart
        [items]="items"
        [total]="total"
        (checkoutRequested)="checkoutRequested($event)"
        (itemRemoved)="itemRemoved($event)">
      </ts-mini-cart>
    `,
  }),
};

export default meta;
type Story = StoryObj<TsMiniCartComponent>;

export const ConArticulos: Story = {
  name: 'Con artículos',
};

export const Vacio: Story = {
  name: 'Carrito vacío',
  args: {
    items: [],
    total: 0,
  },
};

export const UnArticulo: Story = {
  name: 'Un artículo',
  args: {
    items: [SAMPLE_ITEMS[0]],
    total: 45000,
  },
};
