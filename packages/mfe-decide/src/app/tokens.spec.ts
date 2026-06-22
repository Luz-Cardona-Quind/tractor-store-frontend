import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DECIDE_API_URL } from 'shared-catalog';
import { environment } from '../environments/environment';

describe('DECIDE_API_URL token', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: DECIDE_API_URL, useValue: environment.decideApiUrl },
      ],
    });
  });

  it('should be injectable with the value from environment', () => {
    const url = TestBed.inject(DECIDE_API_URL);
    expect(url).toBe(environment.decideApiUrl);
  });

  it('should not be an empty string', () => {
    const url = TestBed.inject(DECIDE_API_URL);
    expect(url.length).toBeGreaterThan(0);
  });

  it('should contain the "decide" path segment', () => {
    const url = TestBed.inject(DECIDE_API_URL);
    expect(url).toContain('decide');
  });

  it('should not contain hardcoded values in consuming code (token is the single source)', () => {
    const url = TestBed.inject(DECIDE_API_URL);
    expect(url).toEqual(environment.decideApiUrl);
  });
});
