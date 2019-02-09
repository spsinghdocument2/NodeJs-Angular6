import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Response, Http, Headers } from '@angular/http';
import { AppSettings } from '../app.globals';
import { UnificationAPIService } from './services/unification.api.service';
import { LoginModel } from '../login.model';

@Injectable()
export class AuthorizationService implements OnDestroy {
    isLoggedIn: boolean = true;
     constructor(
        private baseService: UnificationAPIService,
        private http: Http) {

    }
     ngOnDestroy() {
    }
    login(LoginModel): Observable<any> {
        if (!AppSettings.API_BASE_URL) {
           // this.notificationService.error('There is a problem with the API url');
            return Observable.throw(new Error('There is a problem with the API url'));
        }
        let url = `${AppSettings.API_BASE_URL}/account/login`;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
         // headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.baseService.post(url, LoginModel, headers)
             .do(context => {
                 if(context.error == false && context.object.message == 'Successful Login')
                 {
                 this.baseService.authToken = context.object.token;
                this.baseService.currentUser = context.object.fullName;
                this.baseService.currentAccountNumber = context.object.accountNumber;
                this.baseService.currentEmail = context.object.email;
                this.baseService.currentMobileNumber = context.object.mobile;
                this.baseService.isLoggedIn = context.object.login;
                this.isLoggedIn = context.object.login;
                }
             },
        );
    }


}