import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UnificationAPIService } from '../services/unification.api.service';
import { AuthRouterService } from '../auth-router.service';

@Component({
    templateUrl: 'multi-section-list.component.html'
})
export class MultiSectionListComponent {
    lists: any[] = [];

    constructor(
        private baseService: UnificationAPIService,
        private route: ActivatedRoute,
        private authRouter: AuthRouterService
    ) {
        let id = this.route.snapshot.params['id'];
            this.lists = route.snapshot.data['lists'].map(item =>
                ({
                    // constructs a new api service, doesn't use any DependencyInjection here.
                    service: new item.apiService(baseService, item.serviceOptions),
                    sectionName: item.sectionName,
                    navigateRoute: item.navigateRoute,
                    navigateNewRoute: item.navigateNewRoute,
                    navigateManageTies: item.navigateManageTies,
                    id: id,
                    serviceOptions: item.serviceOptions,
                    actionListProvider: (item.actionListProvider ? new item.actionListProvider(authRouter, id, route, baseService) : null),
                    innerControlType:(item.innerControlType && item.innerControlType == 'bhrtree') ? item.innerControlType : 'bhtable',
                    isModalFilterOptionEnabled: item.isModalFilterOptionEnabled,
                    iconType: item.iconType,
                    iconTooltip: item.iconTooltip,
                    deleteMethod: item.deleteMethod,
                    getMethod: item.getMethod,
                    hasSelectAllCheckBoxItem: (item.hasCheckBox == true) ? true : false
                })
            );
    }
}