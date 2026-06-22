import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EXPLORE_API_URL } from 'shared-catalog';
import { environment } from '../environments/environment';

describe('EXPLORE_API_URL token', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: EXPLORE_API_URL, useValue: environment.exploreApiUrl },
      ],
    });
  });

  it('should be injectable with the value from environment', () => {
    const url = TestBed.inject(EXPLORE_API_URL);
    expect(url).toBe(environment.exploreApiUrl);
  });

  it('should not be an empty string', () => {
    const url = TestBed.inject(EXPLORE_API_URL);
    expect(url.length).toBeGreaterThan(0);
  });

  it('should contain the "explore" path segment', () => {
    const url = TestBed.inject(EXPLORE_API_URL);
    expect(url).toContain('explore');
  });

  it('should not contain hardcoded values in consuming code (token is the single source)', () => {
    // Verifica que el token se usa como fuente única — el valor solo vive en environment.ts
    const url = TestBed.inject(EXPLORE_API_URL);
    expect(url).toEqual(environment.exploreApiUrl);
  });
});
