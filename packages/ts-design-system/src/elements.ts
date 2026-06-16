import type { Type } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { TsButtonComponent } from './lib/button/button.component';
import { TsCartCounterComponent } from './lib/cart-counter/cart-counter.component';
import { TsMiniCartComponent } from './lib/mini-cart/mini-cart.component';
import { TsProductCardComponent } from './lib/product-card/product-card.component';
import { TsVariantOptionComponent } from './lib/variant-option/variant-option.component';

interface ElementEntry {
  selector: string;
  component: Type<unknown>;
}

const ELEMENT_REGISTRY: ElementEntry[] = [
  { selector: 'ts-button',         component: TsButtonComponent },
  { selector: 'ts-cart-counter',   component: TsCartCounterComponent },
  { selector: 'ts-mini-cart',      component: TsMiniCartComponent },
  { selector: 'ts-product-card',   component: TsProductCardComponent },
  { selector: 'ts-variant-option', component: TsVariantOptionComponent },
];

createApplication({
  providers: [provideZonelessChangeDetection()],
}).then(({ injector }) => {
  for (const { selector, component } of ELEMENT_REGISTRY) {
    if (!customElements.get(selector)) {
      const customElement = createCustomElement(component, { injector });
      customElements.define(selector, customElement);
    }
  }
});
