import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthRoute } from './auth-route';

///
/// NOTE: As of Angular2 router v3.4.1. 
/// SKI (2/14/2016)
///
/// This class exists because the router couldn't handle the primary router outlet's component changing the section router outlet's component
/// in a relative pathing way.
/// e.g. In the primary routed component, we should be able to do this but can't
///      <a [routerLink]="[{outlets: {aux: ['../../details']}}]">Details</a>
///
/// So, instead, we will use this class to simplify and hackaround the bug by using only pathing from the AuthComponent's point of view
/// (notice no parent relativity ../../)
/// e.g. <a [routerLink]="['home/1']">home</a>   //or
///      <a [routerLink]="[{outlets: {primary:'home/1'}}]">home</a>
/// e.g. <a [routerLink]="[{outlets: {aux:'details'}}]">Detail</a>
///
/// see Plunker https://plnkr.co/edit/VfJhhExNxXhSSnsZ1PiF for a running example
@Injectable()
export class AuthRouterService {
    public nextNavigation: AuthRoute;
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    public navigate(authRoute: AuthRoute) {
        if (authRoute == null) {
            return;
        }

       // console.info("route: ", authRoute);
        this.nextNavigation = authRoute;
        let ngRoute = { outlets: { primary: null, section: null }};
        if (authRoute.primary != null) {
            ngRoute.outlets.primary = authRoute.primary;
        }
        if (authRoute.section != null) {
            ngRoute.outlets.section = authRoute.section;
        }  
        if (ngRoute.outlets.primary != null && ngRoute.outlets.section != null ) {
          this.router.navigateByUrl(`/auth/lending/(${ngRoute.outlets.primary}//section:${ngRoute.outlets.section})`);
        }
        else
        {
         this.router.navigateByUrl(`/auth/portfolio/(${ngRoute.outlets.primary})`);
        }
      
      // this.router.navigate([ngRoute], { relativeTo: this.route });
    }
}
