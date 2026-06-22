import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shell-mfe-error-fallback',
  standalone: true,
  templateUrl: './mfe-error-fallback.component.html',
  styleUrl: './mfe-error-fallback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MfeErrorFallbackComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly mfeName =
    (inject(ActivatedRoute).snapshot.data['mfeName'] as string | undefined) ?? 'esta sección';

  protected retry(): void {
    this.document.location.reload();
  }
}
