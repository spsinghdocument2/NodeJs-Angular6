  import { Routes,RouterModule } from '@angular/router';
  import { AuthorizedComponent } from './authorized.component';
 import { PaymentRoutes } from '../payment/payment.routes';
  import { HomeComponent } from '../payment/home/home.component';
import { AuthorizationGuard } from './guards/authorization.guard';

export const AuthorizedRoutes: Routes = [
    {
        path: 'auth/:module',
        component: AuthorizedComponent,
         canActivate: [AuthorizationGuard],
        children: [
          ...PaymentRoutes
        ]
    },
          { path: '**', redirectTo: 'login' },
 
];





