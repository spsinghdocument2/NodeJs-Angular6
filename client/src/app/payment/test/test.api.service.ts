import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UnificationAPIService } from '../../shared/services/unification.api.service';
import { IColumnDefinition } from '../../shared/services/pageable-table-service.interface';
import { TableService } from '../../shared/services/table.service';

@Injectable()
export class TestAPIService extends TableService
{
    private url: string;
    constructor(protected baseService: UnificationAPIService)
    {
        super(baseService);
        this.url = this.baseService.complexApiURL() + 'v1/';        
    };

    get dataUrl(): string
    {
        return this.baseService.complexApiURL() + 'v1/userapi/fetchData';
    }

    get columns(): Array<IColumnDefinition> {
        return [
            { DisplayText: 'id', ColumnName: 'id', DataType: 'string', IsKeyColumn: true },
            { DisplayText: 'Deleted', ColumnName: 'deletedAt', DataType: 'string' },
            { DisplayText: 'Del', ColumnName: 'deleted', DataType: 'string' },
            { DisplayText: 'Created', ColumnName: 'createdAt', DataType: 'string' },
            { DisplayText: 'Updated', ColumnName: 'updatedAt', DataType: 'string' },
            { DisplayText: 'Code', ColumnName: 'code', DataType: 'string' },
            { DisplayText: 'IpAddress', ColumnName: 'ipAddress', DataType: 'string' },
            { DisplayText: 'message', ColumnName: 'message', DataType: 'string' },
            { DisplayText: 'action', ColumnName: 'action', DataType: 'string' },
            { DisplayText: 'createdDate', ColumnName: 'CreatedDate', DataType: 'string' },
            { DisplayText: 'accountNumber', ColumnName: 'accountNumber', DataType: 'string' }
        ];
    };
    getDataMap(result) {
        var output: any;
        let opportunities: any[] = [];
        var activityLinks = result.object;
        for(var opp in activityLinks)
        {
             let item = {
                    id: '', deletedAt: '', deleted: '', createdAt: '', updatedAt: '', code: '',
                    ipAddress: '', message: '', action: '', CreatedDate: '',accountNumber:'',Id: ''
                };
                item.id = activityLinks[opp]._id;
                item.deletedAt = activityLinks[opp].deletedAt;
                item.deleted = activityLinks[opp].deleted;
                item.createdAt = activityLinks[opp].createdAt;
                item.updatedAt = activityLinks[opp].updatedAt;
                item.code = activityLinks[opp].code;
                item.ipAddress = activityLinks[opp].ipAddress;
                item.message = activityLinks[opp].message;
                item.action = activityLinks[opp].action;
                item.CreatedDate = activityLinks[opp].CreatedDate;
                item.accountNumber = activityLinks[opp].accountNumber;
                item.Id = activityLinks[opp]._id;
                opportunities.push(item);
        }
        output = opportunities;
        return output;
    };
       getById(id: string): Observable<any>
        {
            alert(id);
        //let url: string = this.baseService.apiURL() + `Users(${id})?$select=Id,FullName,TeamTitleId`;
        return //this.baseService.get(url);
    }
    getByIds(ids: string[]): Observable<any> {
      let idListObject = { IdList: ids };
      let body = JSON.stringify(idListObject);
      let url = '' //AppSettings.API_BASE_URL + 'api/clientdetails/GetServiceProviderLabelFromIds'
      return this.baseService.post(url, body).map(result => {
          return {
              Label: result.join(', ')
          }
      });
  }
}