import { TestBed } from '@angular/core/testing';
import { ProductStore } from './product.store';
import type { ProductState } from './product.store';

function setup() {
  TestBed.configureTestingModule({ providers: [ProductStore] });
  return TestBed.inject(ProductStore);
}

describe('ProductStore', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should be created', () => {
    expect(setup()).toBeTruthy();
  });

  it('should have null product in initial state', () => {
    const store = setup();
    expect(store.snapshot().product).toBeNull();
  });

  it('should have null selectedSku in initial state', () => {
    const store = setup();
    expect(store.snapshot().selectedSku).toBeNull();
  });

  it('should have loading false in initial state', () => {
    const store = setup();
    expect(store.snapshot().loading).toBe(false);
  });

  it('should have null error in initial state', () => {
    const store = setup();
    expect(store.snapshot().error).toBeNull();
  });

  it('should update state immutably via update()', () => {
    const store = setup();
    const before = store.snapshot();

    store.update((s) => ({ ...s, loading: true }));

    const after = store.snapshot();
    expect(after.loading).toBe(true);
    expect(before.loading).toBe(false);
  });

  it('should preserve other fields when updating a single field', () => {
    const store = setup();
    store.update((s) => ({ ...s, selectedSku: 'SKU-001' }));

    const state = store.snapshot();
    expect(state.selectedSku).toBe('SKU-001');
    expect(state.product).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should update error independently', () => {
    const store = setup();
    store.update((s) => ({ ...s, error: 'Algo salió mal.' }));

    expect(store.snapshot().error).toBe('Algo salió mal.');
  });

  it('should support chained updates', () => {
    const store = setup();
    store.update((s) => ({ ...s, loading: true }));
    store.update((s) => ({ ...s, loading: false, selectedSku: 'SKU-X' }));

    const state: ProductState = store.snapshot();
    expect(state.loading).toBe(false);
    expect(state.selectedSku).toBe('SKU-X');
  });
});
