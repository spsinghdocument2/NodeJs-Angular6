import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UnificationAPIService } from '../../shared/services/unification.api.service';

@Injectable()
export class HomeAPIService
{
    private url: string;
    constructor(protected baseService: UnificationAPIService)
    {
        this.url = this.baseService.complexApiURL();
    };
    getLone(accountNumber: string): Observable<any>
    {
        let url = this.url + `home/getAccounts/${accountNumber}`;
        return this.baseService.get(url);
    };
}
