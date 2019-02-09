import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NotificationService } from '../services/notification.service';

import { AppFunctions } from '../app.functions';
import {  IPageableTableService, IColumnSearch, IColumnDefinition, IFilterOptions, IColumnSort } from '../services/pageable-table-service.interface';
import { FilterPipe } from '../pipes/search.pipe'
@Component({
    selector: 'bh-r-table',
    templateUrl: 'bh-r-table.component.html'
})
export class TableRComponent implements OnDestroy {
    private serviceSubscription: Subscription;
    @Input() service: IPageableTableService;
    @Input() disabledValues: any;
    @Input() contantFilters: any;
    @Input() showFilters: boolean = false;
    @Input() showPagination: boolean = false;
    @Input() showCritical: boolean = false;
    @Input() initialSearch: boolean = false;
    @Input() defaultFilters: any;
    @Input() iconType: string = null;
    @Input() iconTooltip: string = "Edit/View Details";
    @Input() checkBoxToolTip: string = "Select";
    @Input() rows: any[] = [];
    @Input() isLoading: boolean = false;
    @Input() columns: any[];
    @Input() isMultiSelect: boolean = false;
    @Input() hasCheckBoxItems: boolean = false;
    @Input() hasSelectAllCheckBoxItem: boolean = false;
    @Input() selectedRowsIds: string[] = [];
    @Input() showGlobalSearch: boolean = true;
    //handle to hide edit button if navigation url is null
    @Input() showViewEditColumn: boolean = true;
    @Input() showDeleteColumn: boolean = false;
    @Input() deleteIconClass: string = "fa fa-fw fa-trash fa-lg";
    @Input() deleteIconTooltip: string = "Remove Instance";
    private sort: any;
    private selectedRowKeyVal: any;
    private pagingStartRow: number = 0;
    private pagingEndRow: number = 20;
    private globalSearchText: string = '';
    private totalRows: number = 0;
    private columnSearches: IColumnSearch[] = [];
    private selectAll: boolean = false;
    private groups: any[] = [];
    private displayRemainingGroups: boolean = false;
    private iconClass: string = "fa fa-fw fa-pencil fa-lg";

    @Output() delete: EventEmitter<Function> = new EventEmitter<Function>();
    public theDeleteCallback: Function;


    @Output() selectedRow = new EventEmitter();
    @Output() rowsPopulated = new EventEmitter();
    @Output() pageNumberChange = new EventEmitter();
    @Output() pageLengthChange = new EventEmitter();
    @Output() sortChange = new EventEmitter();
    @Output() filterChange = new EventEmitter();
    @Output() checkRow = new EventEmitter();
    @Output() clearChecked = new EventEmitter();
    @Output() selectedRowsIdsChange = new EventEmitter();

    private pagesShowing: Array<number> = [1];
    private pageLength: number = 10;
    private currentPage: number = 1;
    private gotoPage: number = 0;
    private forceUpdateOfCurrentPage: boolean = true;

    private totalPages: number = 1;
    private showLessPages: boolean = false;
    private showMorePages: boolean = false;

    private toString = Object.prototype.toString;
    private keyColumn: string;
    private selectedRowObject = null;
    private deleteRowObject = null;
    private internalSort: any = {
        columnName: null,
        isDescending: false,
        columnReference: null
    };
    private queryHasRun: boolean = false;

    // for detail section
    private detailRowIdList: any[] = [];
    private detailColumn: any;
    private showDetail: boolean = false;
    private onPageDataCount: any = 0;
    private   column: string = '';
    private  direction: number;
    
    constructor(
        private notificationService: NotificationService,
        ) {

    }

    ngOnInit() {
        if (!this.service.columns) {
            throw new Error('The service must be a IPageableTableService and implement "columns"');
        }
        this.columns = this.service.columns.filter(x => x.IsDetailLine != true);
        this.detailColumn = this.service.columns.filter(x => x.IsDetailLine == true)[0];
        this.showDetail = (this.detailColumn != null) ? true : false;

        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].IsKeyColumn) {
                this.keyColumn = this.columns[i].ColumnName;
                break;
            }
        }
        this.iconTooltip = (this.iconTooltip) ? this.iconTooltip : 'Edit/View Details';

        if (this.initialSearch) {
            this.search();
        }
        switch (this.iconType) {
            case 'pencil':
                this.iconClass = 'fa fa-fw fa-pencil fa-lg';
                break;
            case 'eye':
                this.iconClass = 'fa fa-fw fa-eye fa-lg';
                break;
            case 'link':
                this.iconClass = 'fa fa-fw fa-link fa-lg';
                break;
            case 'plus':
                this.iconClass = 'fa fa-fw fa-plus fa-lg';
                break;
            default:
                this.iconClass = 'fa fa-fw fa-pencil fa-lg';
                break;
        }

        this.theDeleteCallback = this.deleteCallback.bind(this);
    }

    onDelete(rowObject) {
        this.deleteRowObject = rowObject;
        this.notificationService.confirm(this.theDeleteCallback, "Are you sure you want to delete?");
    }

    private deleteCallback() {
        this.delete.emit(this.deleteRowObject);
        if (this.selectedRowObject && this.selectedRowObject.Id == this.deleteRowObject.Id) {
            this.selectedRowObject = null;
        }
    }

    getData(resetCurrentPage) {
        this.selectAll = false;
        this.queryHasRun = true;
        if (resetCurrentPage) {
            this.currentPage = (this.gotoPage > 0) ? this.gotoPage : 1;
            this.pageNumberChange.emit(this.currentPage);
            this.gotoPage = 0;
        }
        let filterOptions = <IFilterOptions>{
            columnFilters: this.columnSearches,
            sort: this.internalSort,
           // skip: (this.currentPage - 1) * this.pageLength,
            skip:this.currentPage,
            take: (this.showPagination) ? this.pageLength : 0,
            globalFilter: this.globalSearchText,
            bhrtable:'bhrtable'
        };

        if (this.serviceSubscription && !this.serviceSubscription.closed) {
            // if a search is already underway, cancel it since we are about to start another.
            this.serviceSubscription.unsubscribe();
        }
        this.isLoading = true;
        this.serviceSubscription = this.service.getPage(filterOptions)
            .subscribe(data => {
                if (data.rows != undefined ) {
                    
                            //////////////////////
     if(this.columnSearches.length != 0){
    let keys = [];
     let ans = [];
     keys = this.columnSearches;
     for (let i of data.rows) {
     for (let k of keys)
     {  
     if(i[k.columnName] === null || i[k.columnName] === undefined){}
     else if (i[k.columnName].toString().match('^.*' + k.search +'.*$'))
     {
        ans.push(i);
        break;
      }
    }
  }
  this.rows = ans;
    }
    else{
this.rows = data.rows;
    }
                    
                    
                    
                    



                    this.onPageDataCount = data.totalCount;
                    if (data.columns)
                        this.columns = data.columns;

                    this.groups = [];
                    for (let column of this.columns) {
                        if (column.IsGroupColumn)
                            this.groups.push(column);
                        else
                            break;
                    }
                }
                else if (data.length > 0) {
                    this.rows = data;
                }
                else if (data.length == 0) {
                    this.rows = [];
                }
                else {
                    throw new Error('The data did not contain a property called "value".  Do not remove it in the mapping process.');
                }
                this.rowsPopulated.emit(this.rows);
                //data['@odata.count'] = data.length;
                this.totalRows = data.totalCount;
                this.totalPages = Math.ceil(this.totalRows / this.pageLength);
                this.isLoading = false;
            },
            error => {
                this.isLoading = false;
            });
    }

    renderColumnValue(dataObject: any, columnName: string) {
        let value = AppFunctions.traverseModelForProperty(dataObject, columnName);
        if (!!value && typeof value === "string") {
            value = value.replace(/\r\n/g, "<br/>");
        }
        return value;
    }

    checkBoxClicked(rowObject): void {
        if (!rowObject.isChecked)
            rowObject.isChecked = false;
        rowObject.isChecked = !rowObject.isChecked;
        this.checkRow.emit(rowObject);

        if (rowObject.isChecked) {
            this.selectedRowsIds.push(rowObject.Id);
        }
        else {
            this.removeCheckedRow(rowObject.Id);
            if (this.selectedRowsIds.length === 0) {
                this.clearChecked.emit();
            }
        }
        if (this.selectedRowsIds.length == this.onPageDataCount) {
            this.selectAll = true;
        } else {
            this.selectAll = false;
        }
        this.selectedRowsIdsChange.emit(this.selectedRowsIds);
    }

    selectionAllClicked(rowObject): void {
        if (rowObject.length > 0 && !this.selectAll) {
            this.selectAll = true;
            for (let count = 0; count < rowObject.length; count++) {
                rowObject[count].isChecked = true;
                if (this.selectedRowsIds.indexOf(rowObject[count].Id) === -1) {
                    this.checkRow.emit(rowObject[count]);
                    this.selectedRowsIds.push(rowObject[count].Id);
                }
            }
            this.checkRow.emit(rowObject);
            this.selectedRowsIdsChange.emit(this.selectedRowsIds);
        }
        else if (this.selectAll) {
            this.selectAll = false;
            for (let count = 0; count < rowObject.length; count++) {
                rowObject[count].isChecked = false;
                this.checkRow.emit(rowObject[count]);
            }
            this.selectedRowsIds.length = 0;
            this.clearChecked.emit();
        }

    }

    removeCheckedRow(id): void {
        let index = this.selectedRowsIds.indexOf(id);
        if (index > -1) {
            this.selectedRowsIds.splice(index, 1);
        }
    }

    clearCheckedRows(): void {
        for (let checkedRowId of this.selectedRowsIds) {

            let index = this.rows.map((x) => x.Id).indexOf(checkedRowId);
            if (index > -1) {
                let row = this.rows[index];
                row.isChecked = false;
            }
        }
        this.selectedRowsIds = [];
        this.clearChecked.emit();
    }

    rowClicked(rowObject): void {
        if (this.selectedRowObject !== null && this.isMultiSelect === false) {
            this.selectedRowObject.isSelected = false;
        }
        rowObject.isSelected = !rowObject.isSelected;
        this.selectedRowObject = rowObject;
        this.selectedRow.emit(
            rowObject
        )
    }

    search() {  
        this.clearCheckedRows();
        let columnSearchs: IColumnSearch[] = [];
        this.columns.forEach(column => {
            if (column.searchText) {
                columnSearchs.push({
                    columnName: column.ColumnName,
                    search: column.searchText,
                    dataType: column.DataType
                });
            }
        });
        this.columnSearches = columnSearchs;
        
        this.getData(true);



        let filters = columnSearchs.slice(0);
        if (this.globalSearchText) {
            filters.push({
                columnName: '_globalFilter_',
                search: this.globalSearchText,
                dataType: ''
            });
        }
        this.filterChange.emit(filters);
    }

    public setFilters(newFilters: IColumnSearch[]) {
        this.clearCheckedRows();
        let filters = newFilters.slice(0);
        let index = filters.findIndex(f => f.columnName == '_globalFilter_');
        if (index != -1) {
            this.globalSearchText = filters[index].search;
            filters.splice(index, 1);
        }

        this.columnSearches = filters;
        for (let filter of filters) {
            let column = this.columns.find(c => c.ColumnName == filter.columnName);
            if (column)
                column.searchText = filter.search;
        }
    }

    public onRefresh() {
        this.clearCheckedRows();
        this.clearSearch();
    }

    public clearSearch() {
        this.clearCheckedRows();
        this.globalSearchText = '';
        this.columns.forEach(column => {
            if (column.searchText) {
                column.searchText = '';
            }
        });

        this.search();
    }

    private pageLengthChanged(newPageLength) {
        this.pageLength = Number(newPageLength);
        this.pageLengthChange.emit(this.pageLength);
        this.getData(true);
    }

    public setPageLength(newPageLength: 10 | 20 | 40) {
        this.pageLength = newPageLength;
    }

    public setCurrentPage(newPageNumber) {
        this.clearCheckedRows();
        newPageNumber = parseFloat(newPageNumber);
        if (newPageNumber && newPageNumber > 0 && newPageNumber <= this.totalPages) {
            this.currentPage = newPageNumber;
            this.gotoPage = newPageNumber;
            this.getData(false);
        } else {
            // this is written oddly because we want to refresh the data only if we aren't already
            // on the first page. 
            let callGetData = (this.currentPage !== 1);

            this.currentPage = (this.gotoPage > 0) ? this.gotoPage : 1;
            this.gotoPage = 0;
            this.forceUpdateOfCurrentPage = false;
            setTimeout(() => this.forceUpdateOfCurrentPage = true, 0);

            if (callGetData) {
                this.getData(false);
            }
        }

        this.pageNumberChange.emit(this.currentPage);
    }

    private first(): void {
        if (this.currentPage === 1) {
            return;
        }
        this.setCurrentPage(1);
    };

    private prev(): void {
        if (this.currentPage === 1) {
            return;
        }
        this.setCurrentPage(this.currentPage - 1);
    };

    private next(): void {
        if (this.currentPage === this.totalPages) {
            return;
        }
        this.setCurrentPage(this.currentPage + 1);
    };

    private last(): void {
        if (this.currentPage === this.totalPages) {
            return;
        }
        this.setCurrentPage(this.totalPages);
    };

    get rowStart(): number {
        return ((this.currentPage - 1) * this.pageLength) + 1;
    };

    get rowEnd(): number {
        return Math.min((this.currentPage * this.pageLength), this.totalRows);
    };

    selectedClass(columnName): string {
        return columnName = ''; // this.sort.column ? 'sort-' + this.sort.descending : '';
    }

    selectedRowClass(rowObject) {

        if (rowObject.Disabled && !this.isMultiSelect) {
            return 'row-disabled';
        }
        if (this.selectedRowObject)
            return this.selectedRowObject === rowObject ? 'selected-row' : '';
        else
            return rowObject[this.keyColumn] === this.selectedRowKeyVal ? 'selected-row' : '';
    }


    changeSorting(columnName, event, sortDescending?: boolean) {
        if (event && event.srcElement.localName == 'input') {
            return;
        }

        this.clearCheckedRows();

        let sort = this.internalSort;

        if (sort.columnReference && sort.columnReference.ColumnName != columnName) {
            sort.columnReference.isDescending = null;
        }

        if (sortDescending != undefined) {
            sort.isDescending = sortDescending;
        } else if (sort.columnName == columnName) {
            sort.isDescending = !sort.isDescending;
        } else {
            sort.columnName = columnName;
            sort.isDescending = false;
        }
        let columnDef = this.columns.filter(col => col.ColumnName == columnName);
        sort.columnName = columnName;
        sort.columnReference = columnDef[0];
        if (sort.columnReference != null) {
            sort.columnReference['isDescending'] = (sort.isDescending);
        }

        this.internalSort = sort;
        this.sortChange.emit(sort);

        // if (event)
        // this.getData(true);
      
   
    this.column = sort.columnName;
    this.direction = sort.isDescending ? 1 : -1;

    this.rows.sort(function(a, b){
        if(a[sort.columnName] < b[sort.columnName]){
            return -1 * (sort.isDescending ? 1 : -1);
        }
        else if( a[sort.columnName] > b[sort.columnName]){
            return 1 * (sort.isDescending ? 1 : -1);
        }
        else{
            return 0;
        }
    });
    }

    getRows() {
        return this.rows;
    }

    private displayGroupRow(rowIndex: number, groupIndex: number, group: string): boolean {
        if (rowIndex == 0)
            return true;  //  display all groups for first row of each page

        if (groupIndex == 0)
            this.displayRemainingGroups = false;

        if (!this.displayRemainingGroups) {
            var valueChanged = this.rows[rowIndex][group] != this.rows[rowIndex - 1][group];
            if (valueChanged)
                this.displayRemainingGroups = true;
        }

        return this.displayRemainingGroups || valueChanged;
    }

    private groupRowText(label: string, value: string): string {
        let text = label || '';
        if (text)
            text += ': ';
        text += value || 'Undefined';

        return text;
    }

    cancelBubble(event) {
        event.stopPropagation();
        event.preventDefault();
        return false;
    }

    ngOnDestroy() {
        if (this.serviceSubscription)
            this.serviceSubscription.unsubscribe();
    }

    setShowHideDetail(rowId: number) {
        var index = this.detailRowIdList.indexOf(rowId);
        if (index === -1) {
            this.detailRowIdList = [];
            this.detailRowIdList.push(rowId);
        }
        else {
            this.detailRowIdList.splice(index, 1);
        }
    }

    hideMsg(rowId: number) {
        if (this.detailRowIdList.indexOf(rowId) !== -1) {
            return false;
        }
        return true;
    }
}
