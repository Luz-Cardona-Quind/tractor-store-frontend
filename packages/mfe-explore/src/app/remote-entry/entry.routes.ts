import { Route } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { CategoryComponent } from '../pages/category/category.component';
import { StoresComponent } from '../pages/stores/stores.component';

export const remoteRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'category/:slug', component: CategoryComponent },
  { path: 'stores', component: StoresComponent },
];
