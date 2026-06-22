import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartButtonComponent } from '../cart-button/cart-button.component';

@Component({
  selector: 'explore-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CartButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
