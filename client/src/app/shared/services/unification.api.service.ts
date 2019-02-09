import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response, Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppSettings } from '../../app.globals';
import { NotificationService } from './notification.service';

@Injectable()
export class UnificationAPIService implements OnDestroy {
    complexApiURL(): string { return `${AppSettings.API_BASE_URL}/`; }

    private AUTH_TOKEN: string = 'auth_token';
    private CURRENT_USER_AccountNumber: string = 'accountNumber';
    private CURRENT_USER_Email: string = 'email';
    private CURRENT_USER_MobileNumber: string = 'mobileNumber';
    private CURRENT_USER: string = 'current_user';
    public isLoggedIn: string = "isLoggedIn";

    private REFRESH_TOKEN: string = 'refresh_token';
    private TOKEN_EXPIRES_AT: string = 'expires_at';
    private CURRENT_USER_CLIENT_SECURITY: string = 'current_user_client_security'
    private APP_SETTINGS: string = 'app_settings';
    private refreshTokenSubscription: Subscription;
    private displayingNotification: boolean = false;
    private displayingLoggedOutNotification: boolean = false;
    private logoutTimerId = null;
    private sessionTimeoutWarningMinutes: number = 10;
    private CURRENT_USER_PERMISSIONS: string = 'current_user_permissions';

    get authToken(): string {  return sessionStorage.getItem(this.AUTH_TOKEN); }
    set authToken(value: string) { sessionStorage.setItem(this.AUTH_TOKEN, value); }
    get currentUser(): string { return sessionStorage.getItem(this.CURRENT_USER); }
    set currentUser(value: string) { sessionStorage.setItem(this.CURRENT_USER, value); }
    get currentAccountNumber(): string { return sessionStorage.getItem(this.CURRENT_USER_AccountNumber); }
    set currentAccountNumber(value: string) { sessionStorage.setItem(this.CURRENT_USER_AccountNumber, value); }
    get currentEmail(): string { return sessionStorage.getItem(this.CURRENT_USER_Email); }
    set currentEmail(value: string) { sessionStorage.setItem(this.CURRENT_USER_Email, value); }
    get currentMobileNumber(): string { return sessionStorage.getItem(this.CURRENT_USER_MobileNumber); }
    set currentMobileNumber(value: string) { sessionStorage.setItem(this.CURRENT_USER_MobileNumber, value); }
    get currentIsLoggedIn(): any { return sessionStorage.getItem(this.isLoggedIn); }
    set currentIsLoggedIn(value: any) { sessionStorage.setItem(this.isLoggedIn, value); }


    get refreshToken(): string { return sessionStorage.getItem(this.REFRESH_TOKEN); }
    set refreshToken(value: string) { sessionStorage.setItem(this.REFRESH_TOKEN, value); }
    get appSettings(): string { return sessionStorage.getItem(this.APP_SETTINGS); }
    set appSettings(value: string) { sessionStorage.setItem(this.APP_SETTINGS, value); }
    get currentUserClientSecurity(): any { return sessionStorage.getItem(this.CURRENT_USER_CLIENT_SECURITY); }
    set currentUserClientSecurity(value: any) { sessionStorage.setItem(this.CURRENT_USER_CLIENT_SECURITY, value); }

    get currentUserPermissions(): any { return sessionStorage.getItem(this.CURRENT_USER_PERMISSIONS); }
    set currentUserPermissions(value: any) { sessionStorage.setItem(this.CURRENT_USER_PERMISSIONS, value); }

    get tokenExpiresAt(): string { return sessionStorage.getItem(this.TOKEN_EXPIRES_AT); }
    // set tokenExpiresIn(seconds: number) {
    //     if (!this.displayingLoggedOutNotification) {
    //         let now = moment.utc();
    //         now.add(seconds, 'seconds');
    //         //console.log('UnificationAPIService.tokenExpiresIn(): token expires at: ' + now.format());
    //         sessionStorage.setItem(this.TOKEN_EXPIRES_AT, now.toISOString());
    //         this.startLogoutInterval();
    //     }
    // }

    //grant_type=refresh_token&client_id=xxxxxx&refresh_token=
    clearAuthToken() {
        //console.log('UnificationAPIService.clearAuthToken(): Enter');
        sessionStorage.removeItem(this.AUTH_TOKEN);
        sessionStorage.removeItem(this.REFRESH_TOKEN);
        sessionStorage.removeItem(this.TOKEN_EXPIRES_AT);
        sessionStorage.removeItem(this.CURRENT_USER);
        sessionStorage.removeItem(this.CURRENT_USER_CLIENT_SECURITY);
    }

    // public isLoggedOut(): boolean {
    //     let result = true;
    //     let logoutAt = this.tokenExpiresAt;
    //     if (logoutAt) {
    //         let logoutAtAsMoment = moment.utc(logoutAt, moment.ISO_8601);
    //         let nowAsUtc = moment.utc();

    //         if (nowAsUtc.isBefore(logoutAtAsMoment)) {
    //             result = false;
    //         } }
    //     return result;
    // }

    private checkToClearLogoutInterval() {
        let logoutAt = this.tokenExpiresAt;
        if (logoutAt === null) {
            this.stopLogoutInterval();
        }
        return logoutAt;
    }

    // private showLoggedOutMessage() {
    //     if (this.displayingLoggedOutNotification) {
    //         return;
    //     }

    //     if (this.tokenExpiresAt !== null) {
    //         this.stopLogoutInterval();
    //         this.notificationService.closeAll();
    //         this.displayingNotification = false;

    //         var self = this;
    //         //console.log('UnificationAPIService.showLoggedOutMessage(): Displaying "You have been logged out due to inactivity."');
    //         this.notificationService.error('You have been logged out due to inactivity.').then(() => {
    //             self.displayingLoggedOutNotification = false;
    //         });
    //         this.displayingLoggedOutNotification = true;

    //         this.clearAuthToken();  // ensure canDeactivate guard knows we are logged out
    //         //console.log('UnificationAPIService.showLoggedOutMessage(): Navigating to login page.');
    //         this.router.navigateByUrl('login');
    //     }
    // }

    // private checkTimeout() {
    //     let logoutAt = this.checkToClearLogoutInterval();

    //     if (this.displayingLoggedOutNotification || logoutAt === null) {
    //         return;
    //     }

    //     if (this.isLoggedOut()) {
    //         this.showLoggedOutMessage();
    //         return;
    //     }

    //     if (this.displayingNotification) {
    //         return; // already showing the warning
    //     }

    //     if (this.sessionTimeoutWarningMinutes > 0) {
    //         let warningAt = moment.utc(logoutAt).subtract(this.sessionTimeoutWarningMinutes, 'minutes');
    //         let logoutAtFormatted = moment(logoutAt).format('h:mm:ss A');
    //         let nowAsMoment = moment.utc();

    //         if (nowAsMoment.isSameOrAfter(warningAt)) {
    //             this.displayingNotification = true;
    //             //console.log('UnificationAPIService.checkTimeout(): Displaying "You will automatically be logged at ..."');
    //             this.notificationService.logoutWarning(() => { this.refreshLogin() }, `You will automatically be logged out at ${logoutAtFormatted} Click Refresh to continue your session.`);
    //         }
    //     }
    // }

    // private refreshLogin() {
    //     this.displayingNotification = false;
    //     if (this.tokenExpiresAt !== null) {
    //         //console.log('UnificationAPIService.refreshLogin(): User chose to continue session.');
    //         this.callRefreshToken();
    //     }
    // }

    // public startLogoutInterval(): void {
    //     if (!this.logoutTimerId) {
    //         this.logoutTimerId = setInterval(() => this.checkTimeout(), 60000); // check once a minute to see if we are getting close to timeout
    //         //console.log('UnificationAPIService.startLogoutInterval(): timeout warning interval started');
    //         this.getSessionTimeoutWarning();
    //     }
    // }

    public stopLogoutInterval(): void {
        if (this.logoutTimerId) {
            clearInterval(this.logoutTimerId);
            this.logoutTimerId = null;
            //console.log('UnificationAPIService.stopLogoutInterval(): timeout warning interval stopped');
        }
    }

  

    constructor(
        private http: Http,
        private router: Router,
        private notificationService: NotificationService,) {
    }

    get headers(): any {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = this.authToken;
        if (token !== undefined) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
   

    get(url: string, body: any = ''): Observable<any> {
     let options = new RequestOptions({ body: body, headers: this.headers });
        return this.http.get(url ,options)
			.map(this.extractData)
            .catch(error => this.handleError(error));
    }
    
    post(url: string, body: any = '', headers: any = null): Observable<any> {
        if (headers == null)
            headers = this.headers;
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options)
            .map(this.extractData)
            .catch(error => this.handleError(error));
    }

    patch(url: string, body: any = ''): Observable<any> {
        let options = new RequestOptions({ headers: this.headers });

        return this.http.patch(url, body, options)
            .map(this.extractData)
            .catch(error => this.handleError(error));
    }

    delete(url: string): Observable<any> {
        let options = new RequestOptions({ headers: this.headers });

        return this.http.delete(url, options)
            .map(this.extractData)
            .catch(error => this.handleError(error));
    }

    private checkForInnerMessage(error) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        if (error._body) {
            let body = JSON.parse(error._body);
            if (body.InnerError && body.InnerError.Message) {
                errMsg = body.InnerError.Message;
            }
            if (body.DetailedMessage || body.SimpleMessage) {
                errMsg = (body.DetailedMessage) ? body.DetailedMessage : body.SimpleMessage;
            }

            if (body.Code != null) { 
                errMsg += ` (${body.Code})`;
            }
		}

        return errMsg;
    }

    // public callRefreshToken() {
    //     //console.log('UnificationAPIService.callRefreshToken(): Enter');
    //     if (!this.refreshToken || this.isLoggedOut()) {
    //         //console.log('UnificationAPIService.callRefreshToken(): Aborted by guard clause');
    //         this.refreshTokenTimerRequested = false;
    //         return;
    //     }

    //     let body = `refresh_token=${this.refreshToken}&grant_type=refresh_token`;
    //     let url = `${AppSettings.API_BASE_URL}token`;
    //     let headers = new Headers({
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Authorization': `Bearer ${this.authToken}`
    //     });
    //     let post = this.post(url, body, headers);

    //     //console.log('UnificationAPIService.callRefreshToken(): Requesting refresh token');
    //     this.refreshTokenSubscription = post
    //         .subscribe(context => {
    //             //console.warn('UnificationAPIService.callRefreshToken(): login token refreshed');
    //             this.authToken = context.access_token;
    //             this.refreshToken = context.refresh_token;
    //             this.tokenExpiresIn = context.expires_in;
    //             this.refreshTokenTimerRequested = false;

    //             this.checkToClearLogoutInterval();

    //             this.pubSubService.publishMessage({ MessageType: PubSubMessageTypes.LOGIN_REFRESHED, MessageData: {} });
    //         });
    // }

    private extractData(res: Response) {
        let body;

        if (res.text()) {
            body = res.json();
        }

        return body || {};
    }

    private handleError(error: Response): any {
      
        let errMsg = this.checkForInnerMessage(error);
          this.notificationService.errorMessage(errMsg);
        console.log(error.url);
        console.error(errMsg);

        if (this.displayingLoggedOutNotification) {
            return;
        }

        if (error.status === 401) {
            console.error(error);
           // this.showLoggedOutMessage();
            return;
        }

        let body;

        if (error.text()) {
            body = error.json();

            if (body.Title && body.SimpleMessage) {
               // this.notificationService.error(body.Title + ' : ' + body.SimpleMessage);
               // return Observable.empty;
            }

            if (body.error) {
                if (body.error === 'invalid_grant') {
                    return; // ignore this, handled in global
                }
               // this.notificationService.error(AppFunctions.IsNullOrWhiteSpace(body.error.message) ? body.error : body.error.message);
               // return Observable.empty;
            }
        }

       // this.notificationService.error(errMsg);

        return Observable.throw(errMsg);
    }

    ngOnDestroy() {
        if (this.refreshTokenSubscription)
            this.refreshTokenSubscription.unsubscribe();
    }

    public getFileDownloadURL(token: string, downloadAsAttachment?: boolean): string {
        let contentDisposition: string = 'inline';
        if (downloadAsAttachment) {
            contentDisposition = "attachment";
        }

        let apiUrl = this.complexApiURL() + `filedownload/getfile/${token}/${contentDisposition}/`;
        return apiUrl;
    }
}