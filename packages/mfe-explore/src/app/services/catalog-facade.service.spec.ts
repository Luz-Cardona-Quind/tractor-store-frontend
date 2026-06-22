import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CatalogFacadeService } from './catalog-facade.service';
import { CatalogSelectors } from '../store/catalog.selectors';
import { CatalogActions } from '../store/catalog.actions';

const mockCategories = [
  { id: 'c1', name: 'Campo', slug: 'campo', imageUrl: '/img/campo.jpg' },
];

describe('CatalogFacadeService', () => {
  let facade: CatalogFacadeService;
  let loadHomeSpy: jest.Mock;

  beforeEach(() => {
    loadHomeSpy = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CatalogSelectors,
          useValue: {
            categories: signal(mockCategories),
            recommendations: signal([]),
            isLoading: signal(false),
            error: signal(null),
          },
        },
        {
          provide: CatalogActions,
          useValue: { loadHome: loadHomeSpy },
        },
        CatalogFacadeService,
      ],
    });
    facade = TestBed.inject(CatalogFacadeService);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should expose categories from selectors', () => {
    expect(facade.categories()).toEqual(mockCategories);
  });

  it('should expose isLoading from selectors', () => {
    expect(facade.isLoading()).toBe(false);
  });

  it('should expose error from selectors', () => {
    expect(facade.error()).toBeNull();
  });

  it('should delegate loadHome() to CatalogActions', () => {
    facade.loadHome();
    expect(loadHomeSpy).toHaveBeenCalledTimes(1);
  });
});
