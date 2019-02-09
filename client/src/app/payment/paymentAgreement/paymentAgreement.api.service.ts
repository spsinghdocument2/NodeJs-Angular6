import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UnificationAPIService } from '../../shared/index';
@Injectable()
export class PaymentAgreementAPIService
{
    private url: string;
    constructor(protected baseService: UnificationAPIService)
    {
        this.url = this.baseService.complexApiURL();
    };
    getPaymentAgreement(accountNumber: string): Observable<any>
    {
        let url = this.url + `paymentAgreement/getPaymentAgreement/${accountNumber}`;
        return this.baseService.get(url);
    };
}