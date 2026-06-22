import {
  Component,
  OnInit,
  signal,
  Type,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellHeaderFallbackComponent } from './components/header-fallback/header-fallback.component';
import { ShellFooterFallbackComponent } from './components/footer-fallback/footer-fallback.component';

@Component({
  imports: [RouterModule, NgComponentOutlet, ShellHeaderFallbackComponent, ShellFooterFallbackComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly headerComponent = signal<Type<any> | null>(null);
  protected readonly footerComponent = signal<Type<any> | null>(null);
  protected readonly headerFailed = signal(false);
  protected readonly footerFailed = signal(false);

  ngOnInit(): void {
    import('mfe-explore/Header')
      .then((m) => this.headerComponent.set((m as { HeaderComponent: Type<any> }).HeaderComponent))
      .catch(() => this.headerFailed.set(true));

    import('mfe-explore/Footer')
      .then((m) => this.footerComponent.set((m as { FooterComponent: Type<any> }).FooterComponent))
      .catch(() => this.footerFailed.set(true));
  }
}
