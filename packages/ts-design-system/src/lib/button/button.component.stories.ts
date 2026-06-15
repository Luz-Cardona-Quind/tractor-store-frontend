import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from '@storybook/test';
import { TsButtonComponent, ButtonVariant, ButtonSize } from './button.component';

type ButtonArgs = InstanceType<typeof TsButtonComponent> & { label: string };

const meta: Meta<ButtonArgs> = {
  title: 'Design System/Button',
  component: TsButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Texto del botón (ng-content)',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'] satisfies ButtonVariant[],
      description: 'Estilo visual del botón',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies ButtonSize[],
      description: 'Tamaño del botón',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el botón',
    },
    loading: {
      control: 'boolean',
      description: 'Muestra el spinner y bloquea la interacción',
    },
    clicked: { action: 'clicked' },
  },
  args: {
    label: 'Agregar al carrito',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    clicked: fn(),
  },
  render: ({ label, ...args }) => ({
    props: args,
    template: `<ts-button ${argsToTemplate(args)}>${label}</ts-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Ver detalles' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', label: 'Cancelar' },
};

export const Small: Story = {
  args: { size: 'sm', label: 'Pequeño' },
};

export const Large: Story = {
  args: { size: 'lg', label: 'Grande' },
};

export const Loading: Story = {
  args: { loading: true, label: 'Procesando…' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'No disponible' },
};

export const AllVariants: Story = {
  name: 'Todas las variantes',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex; gap:var(--space-4); flex-wrap:wrap; align-items:center;">
        <ts-button variant="primary">Primary</ts-button>
        <ts-button variant="secondary">Secondary</ts-button>
        <ts-button variant="ghost">Ghost</ts-button>
        <ts-button variant="primary" size="sm">Small</ts-button>
        <ts-button variant="primary" size="lg">Large</ts-button>
        <ts-button variant="primary" [loading]="true">Loading</ts-button>
        <ts-button variant="primary" [disabled]="true">Disabled</ts-button>
      </div>
    `,
  }),
};
