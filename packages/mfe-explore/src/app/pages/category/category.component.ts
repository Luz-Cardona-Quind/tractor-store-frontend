import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TsProductCardComponent } from 'ts-design-system';
import { CatalogFacadeService } from '../../services/catalog-facade.service';

const PRICE_PRESETS = [
  { label: 'Todos los precios', value: null },
  { label: 'Hasta $20,000', value: 20000 },
  { label: 'Hasta $50,000', value: 50000 },
  { label: 'Hasta $100,000', value: 100000 },
  { label: 'Hasta $200,000', value: 200000 },
];

const SKELETON_COUNT = 8;

@Component({
  selector: 'explore-category',
  standalone: true,
  imports: [TsProductCardComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly facade = inject(CatalogFacadeService);

  protected readonly activeCategory = this.facade.activeCategory;
  protected readonly filteredProducts = this.facade.filteredProducts;
  protected readonly isLoading = this.facade.isLoading;
  protected readonly error = this.facade.error;
  protected readonly notFound = this.facade.notFound;
  protected readonly activeFilterCount = this.facade.activeFilterCount;

  protected readonly pricePresets = PRICE_PRESETS;
  protected readonly skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

  protected readonly currentMaxPrice = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => (p.get('maxPrice') ? Number(p.get('maxPrice')) : null)),
    ),
    { initialValue: null },
  );

  constructor() {
    // Recarga al cambiar de slug (navegación entre categorías)
    this.route.paramMap
      .pipe(
        map((p) => p.get('slug') ?? ''),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((slug) => {
        if (slug) this.facade.loadCategory(slug);
      });

    // Sincroniza query params → store filters
    this.route.queryParamMap
      .pipe(
        map((p) => (p.get('maxPrice') ? Number(p.get('maxPrice')) : null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((maxPrice) => {
        if (maxPrice !== null && !isNaN(maxPrice) && maxPrice > 0) {
          this.facade.applyFilter({ maxPrice });
        } else {
          this.facade.clearFilters();
        }
      });
  }

  /** Actualiza el query param maxPrice en la URL. */
  protected onMaxPriceChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const maxPrice = value ? Number(value) : null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: maxPrice ? { maxPrice } : {},
    });
  }

  /** Elimina los query params y limpia los filtros. */
  protected clearFilters(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  /** Navega al detalle del producto seleccionado. */
  protected navigateToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
}
