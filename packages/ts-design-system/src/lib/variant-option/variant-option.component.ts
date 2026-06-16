import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'ts-variant-option',
  standalone: true,
  templateUrl: './variant-option.component.html',
  styleUrl: './variant-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TsVariantOptionComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() selected = false;
  @Input() disabled = false;

  @Output() optionSelected = new EventEmitter<string>();

  handleClick(): void {
    if (!this.disabled) {
      this.optionSelected.emit(this.value);
    }
  }
}
