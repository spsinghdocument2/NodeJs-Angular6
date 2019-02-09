import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { AuthRoute } from '../shared/auth-route';
import { AuthRouterService } from '../shared/auth-router.service';
@Component({
    templateUrl: 'authorized.component.html'
    //providers: [MetadataService, DictionaryService, AuthRouterService, NavigationService, NotificationAPIService, UserSearchAPIService, UserAPIService] 
})
export class AuthorizedComponent implements OnInit, OnDestroy {
  private AUTH_TOKEN: string = 'auth_token';
    private CURRENT_USER_AccountNumber: string = 'accountNumber';
    private CURRENT_USER_Email: string = 'email';
    private CURRENT_USER_MobileNumber: string = 'mobileNumber';
    private CURRENT_USER: string = 'current_user';
private routerLinkVariable = 'auth/test2';
private lending = '/landing';
    constructor(private router: Router,  protected authRouter: AuthRouterService,){};
     ngOnInit() {
        }
          ngOnDestroy() {
    }
private paymentAgreement(): void
{
  this.router.navigateByUrl('/auth/portfolio/(paymentAgreement)');
}
private test(): void
{
  this.router.navigateByUrl('/auth/portfolio/(test)');
}

private test3(): void
{
 this.authRouter.navigate(<AuthRoute>{ primary: 'home', section: 'producthistoryfieldaudithistory2' }, );
}
private home(): void
{
   this.router.navigateByUrl('/auth/lending/(home//section:producthistoryfieldaudithistory2)');
}
private test4(): void
{
  this.authRouter.navigate(<AuthRoute>{ primary: 'test2' }, );

}
 private logout()
 {
 this.router.navigateByUrl('/login');
 sessionStorage.removeItem(this.AUTH_TOKEN);
 sessionStorage.removeItem(this.CURRENT_USER_AccountNumber);
 sessionStorage.removeItem(this.CURRENT_USER_Email);
 sessionStorage.removeItem(this.AUTH_TOKEN);
 sessionStorage.removeItem(this.CURRENT_USER_MobileNumber);
 sessionStorage.removeItem(this.CURRENT_USER_MobileNumber);
}
}