import { Injectable }    from '@angular/core';
import { CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot }    from '@angular/router';
import { AuthorizationService } from '../authorization.service';
import { UnificationAPIService } from '../services/unification.api.service';
//import { UserModel } from './models/UserModel';
@Injectable()
export class AuthorizationGuard implements CanActivate {
   // private currentUser: UserModel = new UserModel();

    constructor(
        //private authService: AuthorizationService,
        private router: Router,
        private unificationAPIService: UnificationAPIService, ) { }

    canActivate(
        // Not using but worth knowing about
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    
    )
    {
        if ( sessionStorage.getItem('accountNumber') != undefined && sessionStorage.getItem('accountNumber') != null && sessionStorage.getItem('accountNumber') != "") {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}