import type { LineItem } from './models';

// ─── Event name constants ─────────────────────────────────────────────────────

export const CART_EVENTS = {
  UPDATED: 'checkout:cart-updated',
  ITEM_ADDED: 'checkout:cart-item-added',
  ITEM_REMOVED: 'checkout:cart-item-removed',
} as const;

export const EXPLORE_EVENTS = {
  STORE_SELECTED: 'explore:store-selected',
} as const;

export const DECIDE_EVENTS = {
  VARIANT_SELECTED: 'decide:variant-selected',
} as const;

// ─── Payload interfaces ───────────────────────────────────────────────────────

export interface CartUpdatedPayload {
  items: LineItem[];
  total: number;
}

export interface CartItemAddedPayload {
  item: LineItem;
}

export interface CartItemRemovedPayload {
  sku: string;
}

export interface StoreSelectedPayload {
  storeId: string;
  storeName: string;
}

export interface VariantSelectedPayload {
  sku: string;
  productId: string;
}

// ─── Typed CustomEvent aliases ────────────────────────────────────────────────

export type CartUpdatedEvent = CustomEvent<CartUpdatedPayload>;
export type CartItemAddedEvent = CustomEvent<CartItemAddedPayload>;
export type CartItemRemovedEvent = CustomEvent<CartItemRemovedPayload>;
export type StoreSelectedEvent = CustomEvent<StoreSelectedPayload>;
export type VariantSelectedEvent = CustomEvent<VariantSelectedPayload>;

// ─── Dispatch helpers ─────────────────────────────────────────────────────────

export function dispatchCartUpdated(target: EventTarget, payload: CartUpdatedPayload): void {
  target.dispatchEvent(
    new CustomEvent(CART_EVENTS.UPDATED, { bubbles: true, composed: true, detail: payload }),
  );
}

export function dispatchCartItemAdded(target: EventTarget, payload: CartItemAddedPayload): void {
  target.dispatchEvent(
    new CustomEvent(CART_EVENTS.ITEM_ADDED, { bubbles: true, composed: true, detail: payload }),
  );
}

export function dispatchCartItemRemoved(target: EventTarget, payload: CartItemRemovedPayload): void {
  target.dispatchEvent(
    new CustomEvent(CART_EVENTS.ITEM_REMOVED, { bubbles: true, composed: true, detail: payload }),
  );
}

export function dispatchStoreSelected(target: EventTarget, payload: StoreSelectedPayload): void {
  target.dispatchEvent(
    new CustomEvent(EXPLORE_EVENTS.STORE_SELECTED, { bubbles: true, composed: true, detail: payload }),
  );
}

export function dispatchVariantSelected(target: EventTarget, payload: VariantSelectedPayload): void {
  target.dispatchEvent(
    new CustomEvent(DECIDE_EVENTS.VARIANT_SELECTED, { bubbles: true, composed: true, detail: payload }),
  );
}

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isCartUpdatedEvent(event: Event): event is CartUpdatedEvent {
  return event.type === CART_EVENTS.UPDATED;
}

export function isCartItemAddedEvent(event: Event): event is CartItemAddedEvent {
  return event.type === CART_EVENTS.ITEM_ADDED;
}

export function isCartItemRemovedEvent(event: Event): event is CartItemRemovedEvent {
  return event.type === CART_EVENTS.ITEM_REMOVED;
}

export function isStoreSelectedEvent(event: Event): event is StoreSelectedEvent {
  return event.type === EXPLORE_EVENTS.STORE_SELECTED;
}

export function isVariantSelectedEvent(event: Event): event is VariantSelectedEvent {
  return event.type === DECIDE_EVENTS.VARIANT_SELECTED;
}
