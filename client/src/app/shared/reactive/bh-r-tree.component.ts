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
import { AppFunctions } from '../app.functions';
import {  IPageableTableService, IColumnSearch, IColumnDefinition, IFilterOptions, IColumnSort,ITreeHierarchy } from '../services/pageable-table-service.interface';

declare var $: any;
@Component({
    selector: 'bh-r-tree',
    templateUrl: 'bh-r-tree.component.html'
})
export class TreeRComponent implements OnDestroy {
    private serviceSubscription: Subscription;
    @Input() service: IPageableTableService;
    @Input() disabledValues: any;
    @Input() contantFilters: any;
    @Input() showFilters: boolean = false;
    @Input() showCritical: boolean = false;
    @Input() initialSearch: boolean = false;
    @Input() defaultFilters: any;
    @Input() iconClass: string = "fa fa-fw fa-pencil fa-lg";
    @Input() iconTooltip: string = "Edit/View Details";
    @Input() checkBoxToolTip: string = "Select";
    @Input() rows: any[] = [];
    @Input() isLoading: boolean = false;
    @Input() columns: any[];
    @Input() isMultiSelect: boolean = false;
    @Input() hasCheckBoxItems: boolean = true;
    @Input() selectedRowsIds: string[] = [];
    @Input() isAllExpandCollapse: boolean = true;
    //handle to hide edit button if navigation url is null
    @Input() showViewEditColumn: boolean = true;

    private sort: any;
    private selectedRowKeyVal: any;
    private globalSearchText: string = '';
    private columnSearches: IColumnSearch[] = [];
    @Output() selectedRow = new EventEmitter();
    @Output() rowsPopulated = new EventEmitter();
    @Output() sortChange = new EventEmitter();
    @Output() filterChange = new EventEmitter();
    @Output() checkRow = new EventEmitter();
    @Output() clearChecked = new EventEmitter();
    @Output() selectedRowsIdsChange = new EventEmitter();
    private toString = Object.prototype.toString;
    public keyColumn: string;
    public selectedRowObject = null;
    private totalRows: number = 0;
    private temp:string = null;
    private internalSort: any = {
        columnName: null,
        isDescending: false,
        columnReference: null
    };
    private queryHasRun: boolean = false;
    public treeHierarchyColumns: ITreeHierarchy;
    public childColspan: number;
    public isAllowSingleSelection: boolean = false;
    public dataSubset = null;

    ngOnInit() {
        if (!this.service.columns) {
            throw new Error('The service must be a IPageableTableService and implement "columns"');
        }
        this.columns = this.service.columns;
        //this.treeHierarchyColumns = this.service["treeHierarchy"];
       this.treeHierarchyColumns = {KeyColumn: "Id", ParentColumn: "ParentId", HierarchyLevelColumn: "Level"}
        this.isAllowSingleSelection =this.service["isAllowSingleSelection"];
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].IsKeyColumn) {
                this.keyColumn = this.columns[i].ColumnName;
                break;
            }
        }
        if (this.keyColumn) {
            this.childColspan = (this.columns.length - 1) + 2;
        }
        else {
            this.childColspan = this.columns.length  + 2;
        }
        if (this.initialSearch) {
            this.search();
        }
    }

    getData(resetCurrentPage) {
        this.queryHasRun = true;
        let filterOptions = <IFilterOptions>{
            columnFilters: this.columnSearches,
            sort: this.internalSort,
            skip: 0,
            take: 0,
            globalFilter: this.globalSearchText
        };
        if (this.serviceSubscription && !this.serviceSubscription.closed) {
            // if a search is already underway, cancel it since we are about to start another.
            this.serviceSubscription.unsubscribe();
        }
        this.isLoading = true;
        this.serviceSubscription = this.service.getPage(filterOptions)
            .subscribe(data => {
                if (data) {
                    // If there is a list of valid ids, limit the list to just valid ids.
                    if (this.dataSubset != null) {
                        data = data.filter(item => this.dataSubset.findIndex(subsetItem => subsetItem.Id === item.Id) !== -1);
                        for (let item of data)
                        {
                            if (data.findIndex(testItem => testItem.Id === item.ParentId) === -1) {
                                item.ParentId = null;
                            }
                        }
                    }
                    if (this.globalSearchText != '' || this.columnSearches.length > 0 ) {
                        //If search is applied then show records as list.
                        this.rows = data;
                    }
                    else {
                         // Parse data into tree hierarchy and assign into rows.
                        this.rows = AppFunctions.parseIntoTreeHierarchy(data, this.treeHierarchyColumns, this.isAllExpandCollapse);
                    }
                    if (data.columns) {
                        this.columns = data.columns;
                    }
                }
                else {
                    throw new Error('The data did not contain a property called "value".  Do not remove it in the mapping process.');
                }
                this.rowsPopulated.emit(this.rows);
                this.totalRows = this.rows.length;
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
                if (this.isAllowSingleSelection) {
                    this.clearCheckedRows();
                }
                this.selectedRowsIds.push(rowObject.Id);
            }
            else {
                this.removeCheckedRow(rowObject.Id);
                if (this.selectedRowsIds.length === 0) {
                    this.clearChecked.emit();
                }
            }
            this.selectedRowsIdsChange.emit(this.selectedRowsIds);
    }

    removeCheckedRow(id): void {
        let index = this.selectedRowsIds.indexOf(id);
        if (index > -1) {
            this.selectedRowsIds.splice(index, 1);
        }
    }

    clearCheckedRows(): void {
        this.rows = AppFunctions.setUncheck(this.rows, this.selectedRowsIds, this.treeHierarchyColumns)
        this.selectedRowsIds = [];
        this.clearChecked.emit();
    }

    rowClicked(rowObject): void {
        this.selectedRowObject = rowObject;
        this.selectedRow.emit(
            rowObject
        )
    }

    selectedRowChange(rowObject): void {
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

    selectedClass(columnName): string {
        return columnName = '';
    }

    selectedRowClass(rowObject) {
        if (rowObject.Disabled && !this.isMultiSelect) {
            return 'row-disabled';
        }
        if (this.selectedRowObject)
            return this.selectedRowObject === rowObject ? 'selectedRow' : '';
        else
            return rowObject[this.keyColumn] === this.selectedRowKeyVal ? 'selectedRow' : '';
    }
    childHiearchyLevelClass(rowObject, i) {
        if (i == 0) {
            if (rowObject.children && rowObject.children.length > 0) {
                return 'tree-tier tree-tier-' + (rowObject[this.treeHierarchyColumns.HierarchyLevelColumn] -  1);
            }
            else {
                return 'tree-col tree-tier tree-tier-' + (rowObject[this.treeHierarchyColumns.HierarchyLevelColumn] - 1);
            }
        }
        else {
            return '';
        }
    }

    public toggleDetails(child: any) {
        if (child.children && child.children.length>0)
        {
            child.showChildren = !child.showChildren;
        }
    }

    onSelectedRowsIdsChange(selectedRowIds: string[]) {
        if (this.isAllowSingleSelection) {
            this.selectedRowsIds = [];
        }
        if (selectedRowIds && selectedRowIds.length > 0) {
            for (let i = 0; i < selectedRowIds.length; i++) {
                if (this.selectedRowsIds.indexOf(selectedRowIds[i]) == -1) {
                    this.selectedRowsIds.push(selectedRowIds[i]);
                }
            }
        }
        this.selectedRowsIdsChange.emit(this.selectedRowsIds);
    }
    changeSorting(columnName, event, sortDescending?: boolean): void {
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
        sort.columnReference['isDescending'] = (sort.isDescending);
        this.internalSort = sort;
        this.sortChange.emit(sort);
        if (event)
            this.getData(true);
    }

    getRows() {
        return this.rows;
    }

    public expandAll() {
        this.rows = AppFunctions.setExpandCollapseAll(this.rows, true);
    }

    public collapseAll() {
        this.rows = AppFunctions.setExpandCollapseAll(this.rows, false);
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
}
