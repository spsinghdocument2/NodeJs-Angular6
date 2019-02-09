import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UnificationAPIService } from '../../shared/services/unification.api.service';
import { IColumnDefinition } from '../../shared/services/pageable-table-service.interface';
import { TableService } from '../../shared/services/table.service';

@Injectable()
export class Test2APIService extends TableService
{
    private url: string;
    constructor(protected baseService: UnificationAPIService)
    {
        super(baseService);
        this.url = this.baseService.complexApiURL() + 'v1/';        
    };
     get dataUrl(): string
    {
        return this.baseService.complexApiURL() + 'v1/userapi/fetchData2';
    }
      get columns(): Array<IColumnDefinition> {
         return [
             { DisplayText: 'Section', ColumnName: 'ObjectBhCode', DataType: 'string', IsGroupColumn: true },
             { DisplayText: 'Type', ColumnName: 'TypeLabel', DataType: 'string' },
             { DisplayText: 'Description', ColumnName: 'TypeDescription', DataType: 'string' },
             { DisplayText: 'Access Level', ColumnName: 'AccessLevel', DataType: 'string' }
         ];
     };
       getData(): Observable<any> {
         let url = this.baseService.complexApiURL() + 'v1/userapi/fetchData2';
         return this.baseService.get(url);
     }
}