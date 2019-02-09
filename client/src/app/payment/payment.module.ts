import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentRoutes } from './Payment.routes';
import { HomeComponent } from './home/home.component';
import { PaymentAgreementComponent } from './paymentAgreement/paymentAgreement.component';
import { SharedModule } from '../shared/shared.module';
import {TestComponent} from './test/test.component';
import {Test2Component} from './test2/test2.component';
import {Test3Component} from './test3/test3.component';

@NgModule({
    imports: [SharedModule],
    declarations: [HomeComponent,PaymentAgreementComponent
    ,TestComponent,Test2Component,Test3Component],
     providers: [],
    entryComponents: [],
    schemas: []
})
export class PaymentModule { }