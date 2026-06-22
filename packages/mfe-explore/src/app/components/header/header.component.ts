import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartButtonComponent } from '../cart-button/cart-button.component';

@Component({
  selector: 'explore-header',
  standalone: true,
  imports: [RouterLink, CartButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
