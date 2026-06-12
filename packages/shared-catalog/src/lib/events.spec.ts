import {
  CART_EVENTS,
  EXPLORE_EVENTS,
  DECIDE_EVENTS,
  dispatchCartUpdated,
  dispatchCartItemAdded,
  dispatchCartItemRemoved,
  dispatchStoreSelected,
  dispatchVariantSelected,
  isCartUpdatedEvent,
  isCartItemAddedEvent,
  isCartItemRemovedEvent,
  isStoreSelectedEvent,
  isVariantSelectedEvent,
  type CartUpdatedPayload,
  type CartItemAddedPayload,
  type CartItemRemovedPayload,
  type StoreSelectedPayload,
  type VariantSelectedPayload,
} from './events';
import type { LineItem } from './models';

const lineItem: LineItem = {
  sku: 'TX-01-GN',
  color: 'Green',
  size: 'XL',
  price: 12000,
  quantity: 1,
  productId: 'TX-01',
  productName: 'TractorX',
};

function dispatchAndCapture<T>(
  dispatchFn: (target: EventTarget, payload: T) => void,
  eventName: string,
  payload: T,
): CustomEvent<T> {
  const target = new EventTarget();
  let captured: CustomEvent<T> | null = null;
  target.addEventListener(eventName, (e) => { captured = e as CustomEvent<T>; });
  dispatchFn(target, payload);
  if (!captured) throw new Error(`Event "${eventName}" was not dispatched`);
  return captured;
}

describe('Event name constants', () => {
  it('defines checkout cart events', () => {
    expect(CART_EVENTS.UPDATED).toBe('checkout:cart-updated');
    expect(CART_EVENTS.ITEM_ADDED).toBe('checkout:cart-item-added');
    expect(CART_EVENTS.ITEM_REMOVED).toBe('checkout:cart-item-removed');
  });

  it('defines explore events', () => {
    expect(EXPLORE_EVENTS.STORE_SELECTED).toBe('explore:store-selected');
  });

  it('defines decide events', () => {
    expect(DECIDE_EVENTS.VARIANT_SELECTED).toBe('decide:variant-selected');
  });
});

describe('dispatchCartUpdated', () => {
  const payload: CartUpdatedPayload = { items: [lineItem], total: 12000 };

  it('dispatches with correct event type', () => {
    const event = dispatchAndCapture(dispatchCartUpdated, CART_EVENTS.UPDATED, payload);
    expect(event.type).toBe(CART_EVENTS.UPDATED);
  });

  it('dispatches with bubbles: true', () => {
    const event = dispatchAndCapture(dispatchCartUpdated, CART_EVENTS.UPDATED, payload);
    expect(event.bubbles).toBe(true);
  });

  it('dispatches with composed: true', () => {
    const event = dispatchAndCapture(dispatchCartUpdated, CART_EVENTS.UPDATED, payload);
    expect(event.composed).toBe(true);
  });

  it('carries the payload in detail', () => {
    const event = dispatchAndCapture(dispatchCartUpdated, CART_EVENTS.UPDATED, payload);
    expect(event.detail.items).toHaveLength(1);
    expect(event.detail.total).toBe(12000);
  });
});

describe('dispatchCartItemAdded', () => {
  const payload: CartItemAddedPayload = { item: lineItem };

  it('dispatches with bubbles and composed true', () => {
    const event = dispatchAndCapture(dispatchCartItemAdded, CART_EVENTS.ITEM_ADDED, payload);
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('carries the line item in detail', () => {
    const event = dispatchAndCapture(dispatchCartItemAdded, CART_EVENTS.ITEM_ADDED, payload);
    expect(event.detail.item.sku).toBe('TX-01-GN');
  });
});

describe('dispatchCartItemRemoved', () => {
  const payload: CartItemRemovedPayload = { sku: 'TX-01-GN' };

  it('dispatches with bubbles and composed true', () => {
    const event = dispatchAndCapture(dispatchCartItemRemoved, CART_EVENTS.ITEM_REMOVED, payload);
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('carries the sku in detail', () => {
    const event = dispatchAndCapture(dispatchCartItemRemoved, CART_EVENTS.ITEM_REMOVED, payload);
    expect(event.detail.sku).toBe('TX-01-GN');
  });
});

describe('dispatchStoreSelected', () => {
  const payload: StoreSelectedPayload = { storeId: 'st-1', storeName: 'Medellín' };

  it('dispatches with bubbles and composed true', () => {
    const event = dispatchAndCapture(dispatchStoreSelected, EXPLORE_EVENTS.STORE_SELECTED, payload);
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('carries storeId and storeName in detail', () => {
    const event = dispatchAndCapture(dispatchStoreSelected, EXPLORE_EVENTS.STORE_SELECTED, payload);
    expect(event.detail.storeId).toBe('st-1');
    expect(event.detail.storeName).toBe('Medellín');
  });
});

describe('dispatchVariantSelected', () => {
  const payload: VariantSelectedPayload = { sku: 'TX-01-GN', productId: 'TX-01' };

  it('dispatches with bubbles and composed true', () => {
    const event = dispatchAndCapture(dispatchVariantSelected, DECIDE_EVENTS.VARIANT_SELECTED, payload);
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('carries sku and productId in detail', () => {
    const event = dispatchAndCapture(dispatchVariantSelected, DECIDE_EVENTS.VARIANT_SELECTED, payload);
    expect(event.detail.sku).toBe('TX-01-GN');
    expect(event.detail.productId).toBe('TX-01');
  });
});

describe('Type guards', () => {
  it('isCartUpdatedEvent returns true for matching event', () => {
    const event = new CustomEvent(CART_EVENTS.UPDATED);
    expect(isCartUpdatedEvent(event)).toBe(true);
  });

  it('isCartUpdatedEvent returns false for non-matching event', () => {
    const event = new CustomEvent(CART_EVENTS.ITEM_ADDED);
    expect(isCartUpdatedEvent(event)).toBe(false);
  });

  it('isCartItemAddedEvent returns true for matching event', () => {
    const event = new CustomEvent(CART_EVENTS.ITEM_ADDED);
    expect(isCartItemAddedEvent(event)).toBe(true);
  });

  it('isCartItemRemovedEvent returns true for matching event', () => {
    const event = new CustomEvent(CART_EVENTS.ITEM_REMOVED);
    expect(isCartItemRemovedEvent(event)).toBe(true);
  });

  it('isStoreSelectedEvent returns true for matching event', () => {
    const event = new CustomEvent(EXPLORE_EVENTS.STORE_SELECTED);
    expect(isStoreSelectedEvent(event)).toBe(true);
  });

  it('isVariantSelectedEvent returns true for matching event', () => {
    const event = new CustomEvent(DECIDE_EVENTS.VARIANT_SELECTED);
    expect(isVariantSelectedEvent(event)).toBe(true);
  });

  it('type guard enables payload narrowing', () => {
    const payload: CartUpdatedPayload = { items: [lineItem], total: 12000 };
    const event = new CustomEvent(CART_EVENTS.UPDATED, { detail: payload });

    if (isCartUpdatedEvent(event)) {
      // TypeScript knows event.detail is CartUpdatedPayload here
      expect(event.detail.total).toBe(12000);
    } else {
      fail('Type guard should have returned true');
    }
  });
});

