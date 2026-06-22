import { Route } from '@angular/router';
import { EXPLORE_API_URL } from 'shared-catalog';
import { environment } from '../../environments/environment';
import { CatalogService } from '../services/catalog.service';
import { CatalogMockService } from '../mocks/catalog-mock.service';
import { CatalogActions } from '../store/catalog.actions';
import { CatalogFacadeService } from '../services/catalog-facade.service';
import { HomeComponent } from '../pages/home/home.component';
import { CategoryComponent } from '../pages/category/category.component';
import { StoresComponent } from '../pages/stores/stores.component';

const catalogProvider = environment.useMocks
  ? { provide: CatalogService, useClass: CatalogMockService }
  : CatalogService;

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [
      { provide: EXPLORE_API_URL, useValue: environment.exploreApiUrl },
      catalogProvider,
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
