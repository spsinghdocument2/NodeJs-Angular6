import { Component, OnInit, ViewChild,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {NotificationService,NavigationService,DetailsFormBaseComponent,BhControl } from '../../shared/index';
import { PaymentAgreementAPIService } from './paymentAgreement.api.service';
import { PaymentAgreementModel } from './paymentAgreement.model';

@Component({
    templateUrl: 'paymentAgreement.component.html',
    providers: [PaymentAgreementAPIService]
})

export class PaymentAgreementComponent  extends DetailsFormBaseComponent implements OnInit, OnDestroy 
{
private accountNumber:string =sessionStorage.getItem('accountNumber');
private model: PaymentAgreementModel = new PaymentAgreementModel();
constructor(
protected notificationService: NotificationService,protected navigationService: NavigationService,
private router: Router,private paymentAgreementAPIService: PaymentAgreementAPIService,
private formBuilder: FormBuilder)
{
       super(notificationService, navigationService)
}
ngOnInit(): void {
		this.isLoading =false;
        this.buildForm();
        this.getData();
}
controlList = {
     IsTermsConditionsControl: <BhControl>{
            key: 'IsTermsConditions',
            label: 'I agree to the terms and conditions above.',
        },
};
 private buildForm(): void {
        this.form = this.formBuilder.group(this.model);
    };
protected hasChanges()
{
        return true;
};
 private getData()
{
this.isLoading = true;
this.addSubscription = Observable.forkJoin(
this.paymentAgreementAPIService.getPaymentAgreement(this.accountNumber)
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
     //this.model.fee =model.fee;
        this.model = model;
        this.isReady = false;
        this.form.patchValue(this.model);
        setTimeout(() => this.isReady = true, 0);
        this.form.markAsPristine();
    }
   private onBack():void
   {
        this.router.navigateByUrl('/auth/home');
   }
}