import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate.guard';
import { HomeComponent } from './home/home.component';
import { PaymentAgreementComponent } from './paymentAgreement/paymentAgreement.component';
import {TestComponent} from './test/test.component';
import {Test2Component} from './test2/test2.component';
import { MultiSectionListComponent } from '../shared/components/multi-section-list.component';
import { TestAPIService } from './test/test.api.service';
import { AuthRoute } from '../shared/auth-route';
import {Test3Component} from './test3/test3.component';
export const PaymentRoutes: Routes = [
     { path: 'home', component: HomeComponent,data: { action: 'add' }, canDeactivate: [CanDeactivateGuard]},
    { path: 'paymentAgreement', component: PaymentAgreementComponent, canDeactivate: [CanDeactivateGuard]  },
      { path: 'test', component: TestComponent , canDeactivate: [CanDeactivateGuard]  },
       { path: 'test', component: TestComponent , canDeactivate: [CanDeactivateGuard]  },
       { path: 'test2', component: Test2Component , canDeactivate: [CanDeactivateGuard]  },
     
    
     { path: 'test3add', component: Test3Component, data: { action: 'add' }, canDeactivate: [CanDeactivateGuard] },
    { path: 'test3details/:id', component: Test3Component, data: { action: 'update' }, canDeactivate: [CanDeactivateGuard] },
     {
        path: 'producthistoryfieldaudithistory',
        component: MultiSectionListComponent,
        data: {
            lists: [
                {
                    // navigateRoute: null,
                  navigateRoute:<AuthRoute>{ primary: 'covenantexpressiondetails/:id' },// null,
                    navigateNewRoute: <AuthRoute>{ primary: 'covenantexpressiondetailsadd' },// null,
                     navigateManageTies: <AuthRoute>{ primary: 'activityopportunityties/:id' },//null,                 
                    sectionName: 'Admin Audit History ',
                    apiService: TestAPIService,
                  // deleteMethod: 'deleteRoleInstance'
                }]
        }
      
    },
     {
        path: 'producthistoryfieldaudithistory2',
        component: MultiSectionListComponent,
        data: {
            lists: [
                {
                    // navigateRoute: null,
                  navigateRoute:<AuthRoute>{ primary: 'test3details/:id' },// null,
                    navigateNewRoute: <AuthRoute>{ primary: 'test3add' },// null,
                     navigateManageTies: <AuthRoute>{ primary: 'test3details/:id' },//null,                 
                    sectionName: 'Admin Audit History',
                    apiService: TestAPIService,
                  // deleteMethod: 'deleteRoleInstance'
                },
                {
                  navigateRoute:<AuthRoute>{ primary: 'test3details/:id' },
                    navigateNewRoute: <AuthRoute>{ primary: 'test3add' },
                     navigateManageTies: <AuthRoute>{ primary: 'test3details/:id' },                 
                    sectionName: 'Grade History',
                    apiService: TestAPIService,
                },
                
                ]
        },
        outlet: 'section'
    },
    { path: '**', redirectTo: 'login' }
]

