import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toArray';

import { AuthRoute } from '../auth-route';
import { AuthRouterService } from '../auth-router.service';

@Injectable()
export class NavigationService {

    private PERSISTED_NAVIGATION: string = 'PERSISTED_NAVIGATION';
    private defaultTitle: string = 'Baker Hill NextGen';
    private navigationAttributes = {
        title: this.defaultTitle,
        navigationHistory: new BehaviorSubject<Array<INavigationPoint>>([]),
        sections: new BehaviorSubject<Array<INavigationSection>>([]),
        operations: new BehaviorSubject<Array<INavigationSection>>([])
    }

    public getSections(): BehaviorSubject<Array<INavigationSection>> {
        return this.navigationAttributes.sections;
    }
    public setSections(newSections: INavigationSection[]) {
        this.navigationAttributes.sections.next(newSections);
        this.clearOperations();
    }
    public getOperations(): BehaviorSubject<Array<INavigationSection>> {
        return this.navigationAttributes.operations;
    }
    public setOperations(newOperations: INavigationSection[]) {
        this.navigationAttributes.operations.next(newOperations);
    }
    public getNavigationPoints(): BehaviorSubject<Array<INavigationPoint>> {
        return this.navigationAttributes.navigationHistory;
    }
    public getLastNavigationPoint(): INavigationPoint {
        if (this.navigationAttributes.navigationHistory.value.length < 1) {
            return null;
        }
        let lastIndex = this.navigationAttributes.navigationHistory.value.length - 1;
        return this.navigationAttributes.navigationHistory.value[lastIndex];
    }

    private persistNavigationAttributes() {
        let navAttributes = {
            title: this.navigationAttributes.title,
            navigationHistory: this.navigationAttributes.navigationHistory.getValue(),
            sections: this.navigationAttributes.sections.getValue()
        };
        sessionStorage.setItem(this.PERSISTED_NAVIGATION, JSON.stringify(navAttributes));
    }

    private set Title(newTitle) {
        this.title.setTitle(newTitle);
    }

    constructor(
        private router: Router,
        private authRouter: AuthRouterService,
        private title: Title
    ) {
        let savedNavigationAttributes = sessionStorage.getItem(this.PERSISTED_NAVIGATION);
        if (!savedNavigationAttributes) {
            return;
        }
        savedNavigationAttributes = JSON.parse(savedNavigationAttributes);
        this.navigationAttributes.title = savedNavigationAttributes['title'];
        this.Title = this.navigationAttributes.title;

        this.navigationAttributes.navigationHistory.next(savedNavigationAttributes['navigationHistory']);
        this.navigationAttributes.sections.next(savedNavigationAttributes['sections']);
    }

    refreshRoute(authRoute: AuthRoute) {
        let navigationHistory = this.navigationAttributes.navigationHistory.getValue();
        let currentRoute = navigationHistory[navigationHistory.length - 1];

        // if the current URL contains the primary
        if (currentRoute != null && currentRoute.route.primary == authRoute.primary) {
            currentRoute.route = authRoute;
            this.addNavigationPoint(currentRoute);
        }
    }

    public addNavigationPoint(navigationPoint: INavigationPoint) {
        // check to see if this nav point is already in the history
        if (!navigationPoint.route) {
            // default to current
            navigationPoint.route = this.getAuthRouteFromUrl(this.router.url);
        }

        let navigationHistory = this.navigationAttributes.navigationHistory.getValue();
        let index = navigationHistory.findIndex(nav => nav.route.primary == navigationPoint.route.primary);

        if (index >= 0) {
            // replace it
            Object.assign(navigationHistory[index], navigationPoint);
            this.Title = navigationHistory[index].displayText;

            // if this isn't the current page, then strip off the newer ones
            if (navigationHistory.length > index + 1) {
                navigationHistory.splice(index + 1);
            }
        } else {
            navigationPoint.class = (navigationHistory.length === 0) ?
                'home' :
                `level-down`;

            navigationHistory.push(navigationPoint);
            this.Title = navigationPoint.displayText;
        }
        this.navigationAttributes.navigationHistory.next(navigationHistory);
        this.persistNavigationAttributes();
    }

    getAuthRouteFromUrl(url: string): AuthRoute {
        let authRoute: AuthRoute = new AuthRoute();

        /*
          This regex accepts the following URL types
            (clientdetails/1//section:addresslist/1)
            (clientdetails/1)
            (section:addresslist/1)  (Not likely, but still supported)
         
        \((.+?)\/?\/?     | capture start: after the initial parenthesis, including optional section slashes
        (section:.*)?     | capture section: and anything till the final parenthesis
        \)\/?             | match the final parenthesis and optional trailing slash
        /i                | case insensitive
        */
        var primaryWithSectionRegex = /\((.+?)\/?\/?(section:.*)?\)\/?/i;
        var matches = primaryWithSectionRegex.exec(url);
        // start at 1, because matches[0] is always the matched string (aka, the URL)
        for (var index = 1; matches != null && index < matches.length; index++) {
            let match = matches[index];
            if (match == null) {
                continue;
            }
            let sectionIndex = match.indexOf('section:');
            if (sectionIndex > -1) {
                authRoute.section = match.substring('section:'.length);
            }
            else {
                authRoute.primary = match;
            }
        }
        return authRoute;
    }

    public removeCurrent() {
        let navigationHistory = this.navigationAttributes.navigationHistory.getValue();
        // if there is only one route left then do nothing
        if (navigationHistory.length > 1) {
            navigationHistory.splice(-1); // remove last

            this.navigationAttributes.navigationHistory.next(navigationHistory);
            this.persistNavigationAttributes();
        }
    }
    public removeSection(sectionName:string) {
        let navigationHistory = this.navigationAttributes.navigationHistory.getValue();
        // if there is only one route left then do nothing
        if (navigationHistory.length > 1) {
            navigationHistory=navigationHistory.filter(x => x.entity != sectionName); // remove sepecified section

            this.navigationAttributes.navigationHistory.next(navigationHistory);
            this.persistNavigationAttributes();
        }
    }

    public addNavigateBackToOriginalClinet(route: any): any {
        let navigationHistory = this.navigationAttributes.navigationHistory.getValue();
        // if there is only one route left then do nothing
        if (navigationHistory.length > 1) {
            navigationHistory.splice(1, 0, route); // add section sepecified position

            this.navigationAttributes.navigationHistory.next(navigationHistory);
            this.persistNavigationAttributes();
        }
    }
    public removeMultipleSectionFromNavigation(sectionName: string) {
        let sectionObjects = this.navigationAttributes.navigationHistory.getValue();
        if (sectionObjects) {
            let section = sectionObjects.filter(x => x.entity === sectionName);
            if (section.length > 1) {
                this.removeCurrent();
            }
        }
    }

    public clear() {
        this.navigationAttributes.title = this.defaultTitle;
        this.navigationAttributes.navigationHistory.next([]);
        this.navigationAttributes.sections.next([]);
        this.navigationAttributes.operations.next([]);
        this.persistNavigationAttributes();
    }

    public navigateBack() {
        let navigationHistory = this.navigationAttributes.navigationHistory.getValue();
        // if there is only one route left then do nothing
        if (navigationHistory.length > 1) {

            let newRoute = navigationHistory[navigationHistory.length - 2];
            this.authRouter.navigate(newRoute.route);
        }
    }

    public navigateQueryBack() {
        let navigationHistory = this.navigationAttributes.navigationHistory.getValue();
        if (navigationHistory.length >= 1) {

            let newRoute = navigationHistory[navigationHistory.length - 2];
            this.authRouter.navigate(newRoute.route);
        }
    }

    public clearOperations() {
        this.navigationAttributes.operations.next([]);
    }
}

export interface INavigationPoint {
    displayText: string;
    entity: string;
    key: string;
    class?: string;
    route?: AuthRoute; // if not passed it, this will be set to the current route
}

export interface INavigationSection {
    displayText: string;
    route: AuthRoute;
}