import { NgModule, Optional, SkipSelf } from '@angular/core';

import * as shared from './index';

@NgModule({
    imports: [],
    exports: [
        // CoreModule should be pure and have no exports
    ],
    declarations: [
        // CoreModule should be pure and have no declarations
    ],
    providers: [
        // singleton services the application uses
       // shared.AuthorizationService,
        shared.UnificationAPIService,
        shared.NotificationService,
        shared.NavigationService,
        shared.AuthRouterService,
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}