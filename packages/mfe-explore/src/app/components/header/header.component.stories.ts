import type { Meta, StoryObj } from '@storybook/angular';
import { within, expect, waitFor } from '@storybook/test';
import { HeaderComponent } from './header.component';

const meta: Meta<HeaderComponent> = {
  title: 'Explore/Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const Default: Story = {
  name: '1. Estado por defecto',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('banner')).toBeVisible();
    await expect(canvas.getByLabelText('The Tractor Store - Inicio')).toBeVisible();
    await expect(canvas.getByText('Tractor Store')).toBeVisible();

    const nav = canvas.getByRole('navigation', { name: 'Navegación principal' });
    await expect(nav).toBeVisible();

    await expect(canvas.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Categorías' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Tiendas' })).toBeVisible();
  },
};

export const ConCarritoVacio: Story = {
  name: '2. Carrito vacío (sin badge)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cartBtn = canvasElement.querySelector('explore-cart-button');
    await expect(cartBtn).not.toBeNull();

    // Badge solo se renderiza cuando totalItems() > 0
    const badge = canvasElement.querySelector('.cart-button__badge');
    await expect(badge).toBeNull();

    const btn = canvas.getByRole('button', { name: 'Carrito de compras vacío' });
    await expect(btn).toBeVisible();
  },
};

export const ConArticulosEnCarrito: Story = {
  name: '3. Carrito con artículos (badge visible)',
  play: async ({ canvasElement }) => {
    document.dispatchEvent(
      new CustomEvent('checkout:cart-updated', {
        detail: {
          items: [
            { sku: 'T-001', name: 'Tractor Campo Pro', quantity: 2, price: 15000 },
            { sku: 'T-002', name: 'Tractor Industrial', quantity: 1, price: 28000 },
          ],
        },
        bubbles: true,
        composed: true,
      }),
    );

    // Con OnPush + Signals, Angular programa el re-render como microtask.
    // waitFor hace polling hasta que el DOM refleje el nuevo estado.
    await waitFor(async () => {
      const badge = canvasElement.querySelector('.cart-button__badge');
      await expect(badge).not.toBeNull();
      await expect(badge?.textContent?.trim()).toBe('3');
    });
  },
};
