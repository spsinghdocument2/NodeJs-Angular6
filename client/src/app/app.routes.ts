import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizedRoutes } from './shared/authorized.routes';

import { LoginComponent } from './login.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    //{ path: '**', component: LoginComponent },
    ...AuthorizedRoutes
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes); 