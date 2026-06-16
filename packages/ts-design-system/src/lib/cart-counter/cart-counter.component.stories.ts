import type { Meta, StoryObj } from '@storybook/angular';
import { TsCartCounterComponent } from './cart-counter.component';

const meta: Meta<TsCartCounterComponent> = {
  title: 'Design System/CartCounter',
  component: TsCartCounterComponent,
  tags: ['autodocs'],
  argTypes: {
    itemCount: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'Número de artículos en el carrito',
    },
  },
  args: {
    itemCount: 3,
  },
  render: (args) => ({
    props: args,
    template: `<ts-cart-counter [itemCount]="itemCount"></ts-cart-counter>`,
  }),
};

export default meta;
type Story = StoryObj<TsCartCounterComponent>;

export const ConArticulos: Story = {
  name: 'Con artículos',
  args: { itemCount: 3 },
};

export const UnArticulo: Story = {
  name: 'Un artículo',
  args: { itemCount: 1 },
};

export const Vacio: Story = {
  name: 'Vacío (oculto)',
  args: { itemCount: 0 },
};

export const CifraAlta: Story = {
  name: 'Cifra alta',
  args: { itemCount: 99 },
};

export const EnContexto: Story = {
  name: 'En contexto (icono de carrito)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:inline-flex; align-items:center; gap:var(--space-2); position:relative;">
        <span style="font-size:1.5rem;" aria-hidden="true">🛒</span>
        <ts-cart-counter [itemCount]="5"></ts-cart-counter>
      </div>
    `,
  }),
};
