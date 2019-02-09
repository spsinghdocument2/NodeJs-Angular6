import { Component, OnInit, ViewChild,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HomeAPIService } from './home.api.service';
import { HomeModel } from './home.model';
import { BhControl,DetailsFormBaseComponent,NavigationService,NotificationService,AuthRouterService,AuthRoute } from '../../shared/index';
@Component({
    templateUrl: 'home.component.html',
    providers: [HomeAPIService]
})

export class HomeComponent  extends DetailsFormBaseComponent implements OnInit, OnDestroy 
{
    private model: HomeModel = new HomeModel();
    private accountNumber:string =sessionStorage.getItem('accountNumber');

    constructor(protected notificationService: NotificationService,
    protected navigationService: NavigationService,
    private homeAPIService: HomeAPIService,
    private router: Router,
    protected authRouter: AuthRouterService,){
    super(notificationService, navigationService);
    };
    ngOnInit(): void
    {
        this.getData();
    };
    ngOnDestroy() {}

    protected hasChanges()
    {
       // let model = this.getUpdatedModel();
        return  true//(model !== null);
    };
	  private getUpdatedModel()
    {

    };
    private getData() {
        this.isLoading = true;
        this.addSubscription = Observable.forkJoin(
            this.homeAPIService.getLone(this.accountNumber)
        ).subscribe(
            data => {
                this.setModel(data[0].object);
               // this.updateForm = true;
                this.isLoading = false;
            },
            error => {
                this.isLoading = false;
            });
    };

    private setModel(model: any): void
    {
     this.model.accountNumber =model.accountNumber;
     this.model.DateDue =model.DateDue;
     this.model.RegularAmountDue =model.RegularAmountDue;
     this.model.AutoPay =model.AutoPay;
     this.model.Frequency = model.Frequency;
     this.model.PaymentMethod = model.PaymentMethod;
    }
private paymentAgreement(): void
{
  this.router.navigateByUrl('/auth/paymentAgreement');
   //this.authRouter.navigate(<AuthRoute>{ primary: 'paymentAgreemen', section: 'taskchainlist' }, );
   //this.authRouter.navigate(<AuthRoute>{ primary: 'paymentAgreemen' })
}
}