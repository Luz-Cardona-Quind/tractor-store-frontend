import type { Meta, StoryObj } from '@storybook/angular';
import { within, expect } from '@storybook/test';
import { FooterComponent } from './footer.component';

const meta: Meta<FooterComponent> = {
  title: 'Explore/Footer',
  component: FooterComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  name: '1. Estado por defecto',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('contentinfo')).toBeVisible();
    await expect(canvas.getByText('🚜 Tractor Store')).toBeVisible();
    await expect(canvas.getByText(/Tu concesionario de tractores de confianza/i)).toBeVisible();

    const nav = canvas.getByRole('navigation', { name: 'Navegación secundaria' });
    await expect(nav).toBeVisible();

    await expect(canvas.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Tiendas' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Carrito' })).toBeVisible();
  },
};

export const ConCopyright: Story = {
  name: '2. Copyright visible',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const copyright = canvasElement.querySelector('.explore-footer__copyright');
    await expect(copyright).not.toBeNull();
    await expect(copyright?.textContent).toContain('2026');
    await expect(canvas.getByText(/The Tractor Store/i)).toBeVisible();
  },
};
