import { Component, OnInit, ViewChild,OnDestroy,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {NotificationService,NavigationService,DetailsFormBaseComponent,BhControl,
        CustomValidators ,ParserHelper,ModalRComponent,IColumnDefinition,UnificationAPIService} from '../../shared/index';
import { Test2APIService } from './test2.api.service';
import { Test2Model } from './test2.model';
import { OptionGroup ,IOptionItem} from '../../shared/models/OptionGroup';
import { BHReport } from '../../shared/models/bhreport';
import { PagingService } from '../../shared/services/paging.service';
@Component({
    templateUrl: 'test2.component.html',
    providers: [Test2APIService]
})

export class Test2Component  extends DetailsFormBaseComponent implements OnInit, OnDestroy 
{
private columns: any[] = [];
private rows: any[] = [];
private data: any;
private isReady2: boolean = false;
private selectedRows: Test2Model[] = [];
private actionsAllowed: boolean = false;
private countRWDRecords: any;
private countYesNoRecords: any;
 @ViewChild('table') table;
 private _taskList: OptionGroup[] = [];
 private globalCashFlowSelected = false;
private queryOptions: any[];
private queryOptionsLoading: boolean = false;
private selectedQueryId: string = '';
private isMultiSelect: boolean = true;
queryListLoading: boolean = true;
 pagingService: PagingService = new PagingService();

constructor(
protected notificationService: NotificationService,
protected navigationService: NavigationService,
private router: Router,
private formBuilder: FormBuilder,
 private userSecurityAccessLevelAPIService: Test2APIService,)
{
        
       super(notificationService, navigationService);
}
ngOnInit(){
		this.isLoading =false;
       // this.buildForm();
       this.getDate();
       let options: IOptionItem[] = [];
       options.push(new BHReport({ Id: '_BHC_Do_Nothing', IsRma: '_BHC_Do_Nothing', IsVisible: false, Name: '_BHC_Do_Nothing', ReportCode: '_BHC_Do_Nothing', SpreadType: '_BHC_Do_Nothing' }));
       options.push(new BHReport({ Id: 'Client', IsRma: 'Client', IsVisible: false, Name: 'Client', ReportCode: 'Client', SpreadType: 'Client' }));
        this._taskList = [];
        this._taskList.push(new OptionGroup("", options));
        this.getall();
}

  actions: any[] = [
        {
            label: 'R Access',
            action: () => this.readAccess(),
            isDisabled: true,
            type: 'ACTION_TYPE_READ_ACCESS'
        },
        {
            label: 'RW Access',
            action: () => this.readWriteAccess(),
            isDisabled: true,
            type: 'ACTION_TYPE_READ_WRITE_ACCESS'
        },
        {
            label: 'RWD Access',
            action: () => this.readWriteDeleteAccess(),
            isDisabled: true,
            type: 'ACTION_TYPE_READ_WRITE_DELETE_ACCESS'
        },
        {
            label: 'No Access',
            action: () => this.noAccess(),
            isDisabled: true,
            type: 'ACTION_TYPE_NO_ACCESS'
        },
        {
            class: 'fa fa-key',
            label: 'Yes Access',    // yes access works same as RW
            action: () => this.readWriteAccess(),
            isDisabled: true,
            type: 'ACTION_TYPE_YES_ACCESS'
        },
        {
            class: 'fa fa-key',
            label: 'RW and Yes Access',
            action: () => this.readWriteAccess(),
            isDisabled: true,
            type: 'ACTION_TYPE_RW_YES_ACCESS'
        },
    ];

private buildForm() {
        //this.form = this.formBuilder.group(this.model);
    };
protected hasChanges()
{
        return true;
};
  readAccess(): void {
        for (let accessLevel of this.selectedRows) {
            accessLevel.OldAccessLevel = accessLevel.AccessLevel;
            accessLevel.AccessLevel = 'R';
        }
        // this.onSave();
    }

    readWriteAccess(): void {
        for (let accessLevel of this.selectedRows) {
            accessLevel.OldAccessLevel = accessLevel.AccessLevel;
            accessLevel.AccessLevel = 'R, W';
        }
        // this.onSave();
    }
      readWriteDeleteAccess(): void {
        for (let accessLevel of this.selectedRows) {
            accessLevel.OldAccessLevel = accessLevel.AccessLevel;
            accessLevel.AccessLevel = 'R, W, D';
        }
        // this.onSave();
    }
     noAccess(): void {
        for (let accessLevel of this.selectedRows) {
            accessLevel.OldAccessLevel = accessLevel.AccessLevel;
            accessLevel.AccessLevel = 'No Access';
        }
        // this.onSave();
    }
    private showEditButton: boolean = false;
    private showMultiSelect: boolean = true;
      private getDate() {
        this.userSecurityAccessLevelAPIService.getData()
            .subscribe(result => {
                this.pagingService._columns = [];  // columns change when query changes
                this.pagingService.data = result.object;
                this.pagingService._columns = this.userSecurityAccessLevelAPIService.columns;

                this.rows = result.object;
                this.columns = this.userSecurityAccessLevelAPIService.columns;
                this.data = {
                    showEditButton: false,
                    showMultiSelect: true,
                    actions: this.actions,
                    rows: result.object,
                    columns: this.columns
                };
                this.isReady2 = true;
            });
    }
  
    private selectedRowList() {
        let selectedRows = this.table.selectedRows;
        if (selectedRows.length > 0) {
            this.selectedRows = [];
            selectedRows.forEach(x => {
                if (x._data._groups == undefined) {
                    this.selectedRows.push(x._data as Test2Model)
                    if (this.selectedRows && this.selectedRows.length > 0) {
                        this.countRWDRecords = this.selectedRows.filter(x => x.FlagYesNo == false);
                        this.countYesNoRecords = this.selectedRows.filter(x => x.FlagYesNo == true);
                        this.enableActions();
                        this.actionsAllowed = false;
                    } else {
                        this.actionsAllowed = true;
                    }
                }
            });
        }
        else {
            this.selectedRows = [];
            this.actionsAllowed = false;
        }
        if (this.selectedRows && this.selectedRows.length > 0) {
            this.actionsAllowed = true;
        }
        else {
            this.actionsAllowed = false;
        }
    }
private enable(type: string) {
        for (let queryAction of this.actions) {
            if (queryAction.type === type) {
                queryAction.isDisabled = false;
                break;
            }
        }
    }

    private disable(type: string) {
        for (let queryAction of this.actions) {
            if (queryAction.type === type) {
                queryAction.isDisabled = true;
                break;
            }
        }
    }

  private enableActions() {
        if (this.countRWDRecords.length > 0 && this.countYesNoRecords.length == 0) {
            this.enable('ACTION_TYPE_READ_ACCESS');
            this.enable('ACTION_TYPE_READ_WRITE_ACCESS');
            this.enable('ACTION_TYPE_READ_WRITE_DELETE_ACCESS');

            this.disable('ACTION_TYPE_YES_ACCESS');
            this.disable('ACTION_TYPE_RW_YES_ACCESS');
        }
        else if (this.countYesNoRecords.length > 0 && this.countRWDRecords.length == 0) {
            this.enable('ACTION_TYPE_YES_ACCESS');

            this.disable('ACTION_TYPE_READ_ACCESS');
            this.disable('ACTION_TYPE_READ_WRITE_ACCESS');
            this.disable('ACTION_TYPE_READ_WRITE_DELETE_ACCESS');
            this.disable('ACTION_TYPE_RW_YES_ACCESS');

        }
        else if (this.countRWDRecords.length > 0 && this.countYesNoRecords.length > 0) {
            this.enable('ACTION_TYPE_RW_YES_ACCESS');
            this.disable('ACTION_TYPE_READ_ACCESS');
            this.disable('ACTION_TYPE_READ_WRITE_ACCESS');
            this.disable('ACTION_TYPE_READ_WRITE_DELETE_ACCESS');
            this.disable('ACTION_TYPE_YES_ACCESS');
        }
        this.enable('ACTION_TYPE_NO_ACCESS');
    }

     onRefresh() {
        this.isReady = false;
       this.selectedRows = [];
       this.actionsAllowed = false;
        this.getDate();
    }
    //------------------------------
     private gridColumns: any[] = [];
    private gridRows: any = []; // this is an any because it will change shape to display the data within the rows/cells
private onCreateConditionClick()
{
let newColumns = [{DisplayText: 'Id', ColumnName: 'Id', DataType: 'string', IsKeyColumn: true}, 
{DisplayText: "Type", ColumnName: "Type", DataType: "string",GreenHeader: false, DecisionType: 'Condition'},
{DisplayText: "Description", ColumnName: "Description", DataType: "string",GreenHeader: false, DecisionType: 'Condition'},
{DisplayText: "Access Level", ColumnName: "AccessLevel", DataType: "string",GreenHeader: false, DecisionType: 'Action'}
];
            this.gridColumns =  newColumns;
     }
private onAddRowClick()
 {
let newGridRows = [{Id: 1,Type:'sf1',Description:'gds1',AccessLevel:'sfgg1'},
{Id: 2,Type:'sf2',Description:'gds2',AccessLevel:'sfgg2'}];
 this.gridRows = newGridRows;
}
private TaskTitle():string
    {
        return "Tasks";
    };
    private colHeight(): string
    {
        return "25vh";
    };
     private getPeriods(): OptionGroup[]
    {
        return this._taskList;

    };
    private getRecord(): OptionGroup[]
    {
        return this._taskList;
    };
     private SelectRecord(selectedID: string)
    {
        let self = this;
       this.globalCashFlowSelected = false;
        this._taskList.forEach(g => g.SelectOption(selectedID));

    };
      private onSave(closeFunction):void
    {
         let TaskNames = [];
        if (this._taskList[0] === undefined || this._taskList[0]  === null ||  0 === this._taskList[0].getSelectedOptions().length)
        {
            this.notificationService.error("A task chain must have at least one task. Please select a task.");
            return;
        }
        for (var i in this._taskList[0].getSelectedValues())
        {
            TaskNames.push(this._taskList[0].getSelectedValues()[i]);
        }
    }
//     ========================query===========
 
 private getall(){
         var a =[
{id: "1b074c0c-2ee7-43cd-a1cc-4ae04e79deb0", displayText: "Clients by Classification Type", userId: "f0f71d4c-6b7c-11d3-85b6-00902798d201", userName: "Admin", everyoneRead: true},
{id: "eb2b1b25-3497-4cd0-a8ef-588068f2982f", displayText: "Equifax SBFE Current", userId: "f0f71d4c-6b7c-11d3-85b6-00902798d201", userName: "Admin", everyoneRead: false}]
 this.queryOptions = a;
 this.queryOptions.unshift(
                        {
                            id: '',
                            displayText: "< Select a Query >"
                        }
                    );
 }


onChange(restoreState = false) {
        this.queryListLoading = false;
        if (!this.selectedQueryId) {}
}
private onPageNumberChange(pageNumber: number) {}
 onFilteredRowsIdsChange(filteredRowIds: string[]) {
        var filteredRowIds = filteredRowIds;
    }
    onSelectedRowsIdsChange(selectedRowIds: string[]) {
            var a = this.selectedQueryId;
    }
    onClearChecked() {
            var a = this.selectedQueryId;
        // this.hasCheckedRows = false;
        // if (this.actionProvider) {
        //     this.actionProvider.enableDisableAll(false);
        // }
        // this.selectedRowIdsChange.emit([]);
    }
    selectedQueryRow(selectedRow) {
       var a = this.selectedQueryId;     
    }
     onCheckedRow(row) {
        // this.hasCheckedRows = true;
        // if (this.actionProvider) {
        //     this.actionProvider.enableDisableAll(true);
        // }
        // this.checkRow.emit(row);
    }
     onEditQuery() {
             var a = this.selectedQueryId;
     }
}