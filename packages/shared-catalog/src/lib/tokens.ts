import { InjectionToken } from '@angular/core';

/** URL base de la API del team Explore (ej: `http://localhost:8080/explore/api`). */
export const EXPLORE_API_URL = new InjectionToken<string>('EXPLORE_API_URL');

/** URL base de la API del team Decide (ej: `http://localhost:8080/decide/api`). */
export const DECIDE_API_URL = new InjectionToken<string>('DECIDE_API_URL');

/** URL base de la API del team Checkout (ej: `http://localhost:8080/checkout/api`). */
export const CHECKOUT_API_URL = new InjectionToken<string>('CHECKOUT_API_URL');
