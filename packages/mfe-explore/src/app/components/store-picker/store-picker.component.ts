import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import type { Store } from 'shared-catalog';

@Component({
  selector: 'explore-store-picker',
  standalone: true,
  templateUrl: './store-picker.component.html',
  styleUrl: './store-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorePickerComponent {
  @Input({ required: true }) store!: Store;
  @Input() selected = false;

  @Output() storeSelected = new EventEmitter<Store>();

  protected onSelect(): void {
    this.storeSelected.emit(this.store);
  }
}
