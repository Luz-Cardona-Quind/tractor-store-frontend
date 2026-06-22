import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TsProductCardComponent } from 'ts-design-system';
import type { Category, ProductSummary } from 'shared-catalog';
import { CatalogFacadeService } from '../../services/catalog-facade.service';
import { RecommendationsComponent } from '../../components/recommendations/recommendations.component';

const SKELETON_COUNT = 6;

@Component({
  selector: 'explore-home',
  standalone: true,
  imports: [TsProductCardComponent, RecommendationsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly facade = inject(CatalogFacadeService);

  protected readonly categories = this.facade.categories;
  protected readonly recommendations = this.facade.recommendations;
  protected readonly isLoading = this.facade.isLoading;
  protected readonly error = this.facade.error;

  protected readonly skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

  protected readonly placeholder: ProductSummary = {
    id: '',
    name: '',
    category: '',
    price: 0,
    images: [],
  };

  protected readonly showCategorySkeletons = computed(
    () => this.isLoading() && this.categories().length === 0,
  );

  ngOnInit(): void {
    this.facade.loadHome();
  }

  /**
   * Adapta una Category al contrato ProductSummary que acepta TsProductCard.
   * Usa el slug como id para que productSelected devuelva el slug de navegación.
   */
  protected categoryToCard(category: Category): ProductSummary {
    return {
      id: category.slug,
      name: category.name,
      category: category.slug,
      price: 0,
      images: [category.imageUrl],
    };
  }

  /** Navega a la página de la categoría cuyo slug recibe como id del card. */
  protected navigateToCategory(slug: string): void {
    this.router.navigate(['/category', slug]);
  }

  /** Navega al detalle del producto seleccionado. */
  protected navigateToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
}
