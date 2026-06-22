import { Route } from '@angular/router';
import { EXPLORE_API_URL } from 'shared-catalog';
import { environment } from '../../environments/environment';
import { CatalogService } from '../services/catalog.service';
import { CatalogActions } from '../store/catalog.actions';
import { CatalogFacadeService } from '../services/catalog-facade.service';
import { HomeComponent } from '../pages/home/home.component';
import { CategoryComponent } from '../pages/category/category.component';
import { StoresComponent } from '../pages/stores/stores.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [
      { provide: EXPLORE_API_URL, useValue: environment.exploreApiUrl },
      CatalogService,
      CatalogActions,
      CatalogFacadeService,
    ],
    children: [
      { path: '', component: HomeComponent },
      { path: 'category/:slug', component: CategoryComponent },
      { path: 'stores', component: StoresComponent },
    ],
  },
];
