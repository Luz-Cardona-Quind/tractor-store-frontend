import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from '@storybook/test';
import { TsVariantOptionComponent } from './variant-option.component';

const meta: Meta<TsVariantOptionComponent> = {
  title: 'Design System/VariantOption',
  component: TsVariantOptionComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Texto visible de la opción' },
    value: { control: 'text', description: 'Valor emitido al seleccionar' },
    selected: { control: 'boolean', description: 'Estado seleccionado' },
    disabled: { control: 'boolean', description: 'Opción no disponible (sin stock)' },
    optionSelected: { action: 'optionSelected' },
  },
  args: {
    label: 'Verde',
    value: 'verde',
    selected: false,
    disabled: false,
    optionSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: `<ts-variant-option ${argsToTemplate(args)}></ts-variant-option>`,
  }),
};

export default meta;
type Story = StoryObj<TsVariantOptionComponent>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  name: 'Disabled (sin stock)',
  args: { disabled: true },
};

export const TodasLasVariantes: Story = {
  name: 'Todas las variantes',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--space-6);">
        <div>
          <p style="margin:0 0 var(--space-2); font-size:inherit; color:var(--color-text-secondary);">Color</p>
          <div style="display:flex; gap:var(--space-2);">
            <ts-variant-option label="Verde" value="verde" [selected]="true"></ts-variant-option>
            <ts-variant-option label="Rojo" value="rojo"></ts-variant-option>
            <ts-variant-option label="Azul" value="azul"></ts-variant-option>
            <ts-variant-option label="Negro" value="negro" [disabled]="true"></ts-variant-option>
          </div>
        </div>
        <div>
          <p style="margin:0 0 var(--space-2); font-size:inherit; color:var(--color-text-secondary);">Talla</p>
          <div style="display:flex; gap:var(--space-2);">
            <ts-variant-option label="S" value="s"></ts-variant-option>
            <ts-variant-option label="M" value="m" [selected]="true"></ts-variant-option>
            <ts-variant-option label="L" value="l"></ts-variant-option>
            <ts-variant-option label="XL" value="xl" [disabled]="true"></ts-variant-option>
          </div>
        </div>
      </div>
    `,
  }),
};
