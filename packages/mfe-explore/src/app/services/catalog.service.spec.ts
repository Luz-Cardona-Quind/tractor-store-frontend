import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EXPLORE_API_URL } from 'shared-catalog';
import type { HomeResponse } from 'shared-catalog';
import { CatalogService } from './catalog.service';

const MOCK_API_URL = 'http://localhost:8080/explore/api';

const MOCK_HOME: HomeResponse = {
  categories: [
    { id: 'c1', name: 'Tractores de campo', slug: 'tractores-campo', imageUrl: '/img/campo.jpg' },
  ],
  recommendations: [
    { id: 'p1', name: 'TractorMax 3000', category: 'tractores-campo', price: 45000, images: ['/img/t1.jpg'] },
  ],
  stores: [
    { id: 's1', name: 'Tienda Central', address: 'Av. Principal 123', coordinates: { lat: 4.71, lng: -74.07 } },
  ],
};

describe('CatalogService', () => {
  let service: CatalogService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EXPLORE_API_URL, useValue: MOCK_API_URL },
        CatalogService,
      ],
    });
    service = TestBed.inject(CatalogService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET /home using the injected base URL', () => {
    service.getHome().subscribe();
    const req = httpTesting.expectOne(`${MOCK_API_URL}/home`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_HOME);
  });

  it('should return typed HomeResponse on success', (done) => {
    service.getHome().subscribe((response) => {
      expect(response.categories).toHaveLength(1);
      expect(response.categories[0].slug).toBe('tractores-campo');
      expect(response.recommendations).toHaveLength(1);
      expect(response.stores).toHaveLength(1);
      done();
    });
    httpTesting.expectOne(`${MOCK_API_URL}/home`).flush(MOCK_HOME);
  });

  it('should use the EXPLORE_API_URL token and not a hardcoded URL', () => {
    const customUrl = 'http://custom-backend/explore/api';
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EXPLORE_API_URL, useValue: customUrl },
        CatalogService,
      ],
    });
    const customService = TestBed.inject(CatalogService);
    const ctrl = TestBed.inject(HttpTestingController);

    customService.getHome().subscribe();
    ctrl.expectOne(`${customUrl}/home`).flush(MOCK_HOME);
    ctrl.verify();
  });

  it('should propagate HTTP errors without catching them internally', (done) => {
    service.getHome().subscribe({
      error: (err) => {
        expect(err).toBeDefined();
        done();
      },
    });
    httpTesting
      .expectOne(`${MOCK_API_URL}/home`)
      .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
