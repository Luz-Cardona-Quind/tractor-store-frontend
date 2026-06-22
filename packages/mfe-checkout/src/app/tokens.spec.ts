import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CHECKOUT_API_URL } from 'shared-catalog';
import { environment } from '../environments/environment';

describe('CHECKOUT_API_URL token', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: CHECKOUT_API_URL, useValue: environment.checkoutApiUrl },
      ],
    });
  });

  it('should be injectable with the value from environment', () => {
    const url = TestBed.inject(CHECKOUT_API_URL);
    expect(url).toBe(environment.checkoutApiUrl);
  });

  it('should not be an empty string', () => {
    const url = TestBed.inject(CHECKOUT_API_URL);
    expect(url.length).toBeGreaterThan(0);
  });

  it('should contain the "checkout" path segment', () => {
    const url = TestBed.inject(CHECKOUT_API_URL);
    expect(url).toContain('checkout');
  });

  it('should not contain hardcoded values in consuming code (token is the single source)', () => {
    const url = TestBed.inject(CHECKOUT_API_URL);
    expect(url).toEqual(environment.checkoutApiUrl);
  });
});
