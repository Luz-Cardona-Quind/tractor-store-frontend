import { Route } from '@angular/router';
import { DECIDE_API_URL } from 'shared-catalog';
import { environment } from '../environments/environment';
import { ProductService } from './services/product.service';
import { ProductMockService } from './mocks/product-mock.service';
import { ProductActions } from './store/product.actions';
import { ProductFacadeService } from './store/product.facade';
import { ProductComponent } from './pages/product/product.component';
import { productResolver } from './resolvers/product.resolver';

const productProvider = environment.useMocks
  ? { provide: ProductService, useClass: ProductMockService }
  : ProductService;

export const appRoutes: Route[] = [
  {
    path: 'product/:id',
    component: ProductComponent,
    resolve: { product: productResolver },
    providers: [
      { provide: DECIDE_API_URL, useValue: environment.decideApiUrl },
      productProvider,
      ProductActions,
      ProductFacadeService,
    ],
  },
  { path: '', redirectTo: 'product/p-c1', pathMatch: 'full' },
];
