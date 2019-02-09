import { Observable } from 'rxjs/Observable';

import { IPageableTableService, IFilterOptions, IColumnDefinition } from './pageable-table-service.interface';
import { UnificationAPIService } from './unification.api.service';

export abstract class TableService implements IPageableTableService {

    urlParams: string = '';

    constructor(protected baseService: UnificationAPIService) {
    }

    public showAddButton(): boolean { return true; }                

    public abstract get dataUrl(): string;

    public abstract get columns(): Array<IColumnDefinition>;

    public getPage(filterOptions: IFilterOptions): Observable<any> {
        let url: string = this.dataUrl;
        if (this.urlParams != null && this.urlParams !== '') {
            url += this.urlParams;
        }
        if(filterOptions.bhrtable === "bhrtable")
        {      
            url = url+'/'+  filterOptions.skip + '/'+filterOptions.take
        
        }
        return this.baseService.get(url).map(result => this.getDataMap(result));
    }

    protected getDataMap(result): Function {
        return result;
    }

}