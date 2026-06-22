import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { Store } from 'shared-catalog';
import { CatalogFacadeService } from '../../services/catalog-facade.service';
import { StorePickerComponent } from '../../components/store-picker/store-picker.component';

const SKELETON_COUNT = 3;

@Component({
  standalone: true,
  selector: 'explore-stores',
  imports: [StorePickerComponent],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresComponent {
  private readonly facade = inject(CatalogFacadeService);

  protected readonly stores = this.facade.stores;
  protected readonly selectedStore = this.facade.selectedStore;
  protected readonly isLoading = this.facade.isLoading;
  protected readonly error = this.facade.error;
  protected readonly skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

  constructor() {
    if (this.facade.stores().length === 0) {
      this.facade.loadHome();
    }
  }

  /** Delega la selección a la facade, que muta el store y emite el CustomEvent. */
  protected onStoreSelected(store: Store): void {
    this.facade.selectStore(store);
  }
}
