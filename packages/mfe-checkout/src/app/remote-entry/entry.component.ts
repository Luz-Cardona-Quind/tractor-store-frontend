import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'checkout-entry',
  template: '<router-outlet />',
  imports: [RouterModule],
})
export class RemoteEntryComponent {}
