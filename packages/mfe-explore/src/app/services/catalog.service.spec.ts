import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EXPLORE_API_URL } from 'shared-catalog';
import type { CategoryResponse, HomeResponse, RecommendationsResponse, StoresResponse } from 'shared-catalog';
import { CatalogService } from './catalog.service';

const API_URL = 'http://localhost:8080/explore/api';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_HOME: HomeResponse = {
  categories: [{ id: 'c1', name: 'Tractores de campo', slug: 'campo', imageUrl: '/img/campo.jpg' }],
  recommendations: [{ id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: ['/img/t1.jpg'] }],
  stores: [{ id: 's1', name: 'Tienda Central', address: 'Av. Principal 123', coordinates: { lat: 4.71, lng: -74.07 } }],
};

const MOCK_CATEGORY: CategoryResponse = {
  category: { id: 'c1', name: 'Tractores de campo', slug: 'campo', imageUrl: '/img/campo.jpg' },
  products: [{ id: 'p1', name: 'TractorMax 3000', category: 'campo', price: 45000, images: ['/img/t1.jpg'] }],
  filters: [],
  total: 1,
};

const MOCK_STORES: StoresResponse = [
  { id: 's1', name: 'Tienda Central Bogotá', address: 'Av. El Dorado #68B-31', coordinates: { lat: 4.65, lng: -74.10 } },
  { id: 's2', name: 'Sucursal Medellín',     address: 'Cra. 43A #1 Sur-100',   coordinates: { lat: 6.24, lng: -75.58 } },
];

const MOCK_RECOMMENDATIONS: RecommendationsResponse = [
  { id: 'p1', name: 'TractorMax 3000',   category: 'campo',      price: 45000, images: ['/img/t1.jpg'] },
  { id: 'p2', name: 'PowerBull X800',    category: 'industrial', price: 72000, images: ['/img/t2.jpg'] },
  { id: 'p3', name: 'OrchardMaster 300', category: 'huerto',     price: 19500, images: ['/img/t3.jpg'] },
];

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CatalogService', () => {
  let service: CatalogService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EXPLORE_API_URL, useValue: API_URL },
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

  // ── getHome() ─────────────────────────────────────────────────────────────

  describe('getHome()', () => {
    it('should GET /home with the injected base URL', () => {
      service.getHome().subscribe();
      const req = httpTesting.expectOne(`${API_URL}/home`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_HOME);
    });

    it('should return typed HomeResponse on success', (done) => {
      service.getHome().subscribe((res) => {
        expect(res.categories).toHaveLength(1);
        expect(res.recommendations).toHaveLength(1);
        expect(res.stores).toHaveLength(1);
        done();
      });
      httpTesting.expectOne(`${API_URL}/home`).flush(MOCK_HOME);
    });

    it('should propagate 500 without catching it internally', (done) => {
      service.getHome().subscribe({ error: (err) => { expect(err).toBeDefined(); done(); } });
      httpTesting
        .expectOne(`${API_URL}/home`)
        .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should use EXPLORE_API_URL token — not a hardcoded URL', () => {
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
      const svc = TestBed.inject(CatalogService);
      const ctrl = TestBed.inject(HttpTestingController);
      svc.getHome().subscribe();
      ctrl.expectOne(`${customUrl}/home`).flush(MOCK_HOME);
      ctrl.verify();
    });
  });

  // ── getCategory() ─────────────────────────────────────────────────────────

  describe('getCategory()', () => {
    it('should GET /category/:slug with the correct URL', () => {
      service.getCategory('campo').subscribe();
      const req = httpTesting.expectOne(`${API_URL}/category/campo`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_CATEGORY);
    });

    it('should return typed CategoryResponse on success', (done) => {
      service.getCategory('campo').subscribe((res) => {
        expect(res.category.slug).toBe('campo');
        expect(res.products).toHaveLength(1);
        done();
      });
      httpTesting.expectOne(`${API_URL}/category/campo`).flush(MOCK_CATEGORY);
    });

    it('should propagate 404 without catching it internally', (done) => {
      service.getCategory('inexistente').subscribe({
        error: (err) => { expect(err).toBeDefined(); done(); },
      });
      httpTesting
        .expectOne(`${API_URL}/category/inexistente`)
        .flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  // ── getStores() ───────────────────────────────────────────────────────────

  describe('getStores()', () => {
    it('should GET /stores with the correct URL', () => {
      service.getStores().subscribe();
      const req = httpTesting.expectOne(`${API_URL}/stores`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_STORES);
    });

    it('should return a typed Store[] on success', (done) => {
      service.getStores().subscribe((stores) => {
        expect(stores).toHaveLength(MOCK_STORES.length);
        expect(stores[0].id).toBe('s1');
        done();
      });
      httpTesting.expectOne(`${API_URL}/stores`).flush(MOCK_STORES);
    });

    it('should propagate 500 without catching it internally', (done) => {
      service.getStores().subscribe({
        error: (err) => { expect(err).toBeDefined(); done(); },
      });
      httpTesting
        .expectOne(`${API_URL}/stores`)
        .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  // ── getRecommendations() ──────────────────────────────────────────────────

  describe('getRecommendations()', () => {
    it('should GET /recommendations without productId', () => {
      service.getRecommendations().subscribe();
      const req = httpTesting.expectOne(`${API_URL}/recommendations`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RECOMMENDATIONS);
    });

    it('should GET /recommendations?productId=p1 when productId is provided', () => {
      service.getRecommendations('p1').subscribe();
      const req = httpTesting.expectOne(`${API_URL}/recommendations?productId=p1`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RECOMMENDATIONS);
    });

    it('should return a typed ProductSummary[] on success', (done) => {
      service.getRecommendations().subscribe((recs) => {
        expect(recs).toHaveLength(MOCK_RECOMMENDATIONS.length);
        expect(recs[0].name).toBe('TractorMax 3000');
        done();
      });
      httpTesting.expectOne(`${API_URL}/recommendations`).flush(MOCK_RECOMMENDATIONS);
    });

    it('should propagate 500 without catching it internally', (done) => {
      service.getRecommendations().subscribe({
        error: (err) => { expect(err).toBeDefined(); done(); },
      });
      httpTesting
        .expectOne(`${API_URL}/recommendations`)
        .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
