import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    AfterViewInit,
    Output,
    ViewChild
} from '@angular/core';
import { IColumnSearch,IColumnDefinition,IFilterOptions,IColumnSort } from '../services/pageable-table-service.interface'
import * as wjcCore from 'wijmo/wijmo';
import { GroupRow } from 'wijmo/wijmo.grid';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjFlexGridFilter } from 'wijmo/wijmo.angular2.grid.filter';
import { FlexGridPdfConverter, ScaleMode } from 'wijmo/wijmo.grid.pdf';

import * as moment from 'moment'; 

import { NotificationService } from '../services/notification.service';
import { AppFunctions } from '../app.functions';

@Component({
    selector: 'bh-table',
    templateUrl: 'bh-table.component.html'
})
export class TableComponent implements OnInit, AfterViewInit {
    @ViewChild(WjFlexGrid) wjFlexGrid;
    @ViewChild(WjFlexGridFilter) wjFlexGridFilter;
    @Input() columns: any[];
    get visibleColumns() {
        return this.columns.filter(c => c.IsVisible != false && c.IsKeyColumn != true);
    }
    @Input() isTreeView: boolean = false;
    @Input() isTreeViewHierarchicalData: boolean = false;
    @Input() isShowHeaderCheckbox: boolean = true;
    @Input() checkedRowIds: any = [];
    private treeRows: any[];
    @Input() isSearchSelect: boolean = false;
    @Input() isSelectVisible: boolean = false;
    @Input() showPagination: boolean = true;

    @Input() set rows(newRows: any[]) {
        this.isLoading = true;
        this.hasData = (newRows != null && newRows.length > 0) ? true : false;
        if (this.isTreeViewHierarchicalData == true) {
            this.treeRows = newRows;
            if (newRows != null) {
                this.hasData = (newRows.length != 0);
            }
        }
        else {
            this.setRows(newRows);
        }
        this.isLoading = false;
        this.onFilterApplied(null);
        if (this.rows !== undefined && this.rows !== null) {
            this.rowsPopulated.emit(this.rows);
        }
    };
    @Input() isReadOnly: boolean = true;
    private pageLength: number = 10;
    @Input() set initalPageLength(newValue: string) {
        if (newValue != null) {
            this.pageLength = parseInt(newValue, 10);
            this.gridData.pageSize = this.pageLength;
        }

        if (this.fixedHeightOffset > 0 || this.isTreeView) {
            this.pageLength = 999999;
            this.gridData.pageSize = this.pageLength;
        }
    }

    // Set savedPagingAndFilteringKey to enable the preserving of paging and filtering data for this particular data
    @Input() savedPagingAndFilteringKey: string = '';
    private SAVED_PAGING_AND_FILTERING_KEY: string = 'SAVED_PAGING_AND_FILTERING_KEY_';
    get savedPagingAndFiltering(): string { return sessionStorage.getItem(this.SAVED_PAGING_AND_FILTERING_KEY + this.savedPagingAndFilteringKey); }
    set savedPagingAndFiltering(value: string) { sessionStorage.setItem(this.SAVED_PAGING_AND_FILTERING_KEY + this.savedPagingAndFilteringKey, value); }


    @Input() iconType: 'pencil' | 'eye' | 'link' | 'plus' = 'pencil';
    get iconTypeClasses() {
        return `fa fa-fw fa-${this.iconType} fa-lg`;
    }
    @Input() icon2Type: string = 'trash-o';
    get icon2TypeClasses() {
        return `fa fa-fw fa-${this.icon2Type} fa-lg`;
    }
    @Input() showSelectRow: boolean = true;
    @Input() showRowAction: boolean = false;
    @Input() showMultiSelect: boolean = false;
    @Input() showSelectRowBtn: boolean = true;
    @Input() showRowActionBtn: boolean = true;
    @Input() showCheckboxBtn: boolean = true;
    private deleteRowObject = null;
    private isChecked: boolean = false;
    private hasData: boolean = false;
    @Input() allowResizing: string = 'ColumnsAllCells';
    @Input() allowDragging: string = 'Columns';
    @Input() allowMerging: string = 'None';
    @Input() allowSorting: boolean = true;
    @Input() iconTooltip: string = 'View/Edit Details';
    @Input() icon2Tooltip: string = 'Delete Row';
    @Input() showFiltering: boolean = true;
    @Input() fixedHeightOffset: number = 0;
    @Input() groupHeaderFormat: string = '{name}: <b>{value}</b> &nbsp;({count:n0})';
    @Input() frozenColumns: number = 0;
    @Input() childItemsPath: string = null;
    @Input() useDataIcon: string = null;
    @Input() selectedRowsIds: string[] = [];
    @Input() showDeleteColumn: boolean = false;
    @Input() deleteIconClass: string = 'fa fa-fw fa-trash fa-lg';
    @Input() deleteIconTooltip: string = 'Remove Instance';
    @Input() useDynamicIcons: boolean = false;
    @Input() wordWrap: boolean = false;
    @Input() headerWordWrap: boolean = false;
    @Input() iconPropertyName: string = null;
    @Input() isSearchAndSelect: boolean = false;
    private selectedRowObject = null;
    private selectionsOpen: boolean = false;
    get fixedHeightOffsetCalc() {
        if (this.fixedHeightOffset > 0) {
            return 'calc(100vh - ' + this.fixedHeightOffset + 'px)';
        }
    }
    @Input() showAlternatingRows: boolean = true;
    @Input() isLoading: boolean = false;
    @Output() selectedRow = new EventEmitter();
    @Output() checkedRow = new EventEmitter();
    @Output() selectedRowsIdsChange = new EventEmitter();
    @Output() filteredRowsIdsChange = new EventEmitter();
    @Output() clearChecked = new EventEmitter();
    @Output() delete: EventEmitter<Function> = new EventEmitter<Function>();
    public theDeleteCallback: Function;
    @Output() gridDataViewChanged = new EventEmitter();
    @Output() rowAction = new EventEmitter();
    @Output() pagingChange = new EventEmitter();
    @Output() pageLengthChange = new EventEmitter();
    @Output() rowsPopulated = new EventEmitter();
    @Output() hyperLinkCellClickedEvent = new EventEmitter();
    @Input() numberOfRowSelection: number = null;
    @Input() isDisableSelectedRows: boolean = false;
    get selectedRows() {
        return this.wjFlexGrid.selectedRows;
    }
    private gridData: wjcCore.CollectionView = new wjcCore.CollectionView();
    constructor(private notificationService: NotificationService) {
        wjcCore.culture.FlexGridFilter.null = 'IsEmpty';
    }
    ngOnInit() {
        this.gridData.pageSize = this.pageLength;
        this.wjFlexGrid.rowHeaders.columns[0].width = 30;
        //this.wjFlexGrid.columnHeaders.rows[0].height = 38;
        this.wjFlexGrid.rows.defaultSize = 38;

        if (this.showSelectRow == true && this.showMultiSelect == false && this.isTreeView == false) {
            this.frozenColumns = 1;
        } else if (this.showSelectRow == true && this.showMultiSelect == true && this.isTreeView == false) {
            this.frozenColumns = 2;
        } else {
            this.frozenColumns = 0;
        }

        switch (this.iconType) {
            case 'pencil':
                this.iconTooltip = this.iconTooltip || 'View/Edit Details';
                break;
            case 'eye':
                this.iconTooltip = this.iconTooltip || 'View';
                break;
            case 'link':
                this.iconTooltip = this.iconTooltip || 'Tie';
                break;
            case 'plus':
                this.iconTooltip = this.iconTooltip || 'Select';
                break;
            default:
                this.iconTooltip = this.iconTooltip;
        }
        this.theDeleteCallback = this.deleteCallback.bind(this);
        this.onFilterApplied(null);
    }

    propsOf(object) {
        if (object == null) {
            return 'none';
        }
        return console.log(object);
    }

    ngAfterViewInit() {
        let wijmoColumns = this.wjFlexGrid.columns;
        this.setCheckedRows(null);
        for (let column of wijmoColumns) {
            if (column._binding != undefined && !this.isSearchAndSelect) {
                this.wrapDescription(column);
            }
            if (this.columns != undefined) {
                if (this.showMultiSelect) {
                    if (this.showSelectRow) {
                        if ((column.index != 1) && (this.columns[column.index - 2] && ((this.columns[column.index - 2].IsGroupColumn === true) || (this.columns[column.index - 2].IsKeyColumn === true)))) {
                            column.visible = false;
                        }
                    }
                    else {
                        if ((column.index != 0) && (this.columns[column.index - 1] && ((this.columns[column.index - 1].IsGroupColumn === true) || (this.columns[column.index - 1].IsKeyColumn === true)))) {
                            column.visible = false;
                        }
                    }
                }
                else {
                    if (this.showSelectRow || this.showDeleteColumn) {
                        if ((column.index != 0) && (this.columns[column.index - 1] && ((this.columns[column.index - 1].IsGroupColumn === true) || (this.columns[column.index - 1].IsKeyColumn === true)))) {
                            column.visible = false;
                        }
                    }
                    else {
                        if ((this.columns[column.index] && ((this.columns[column.index].IsGroupColumn === true) || (this.columns[column.index].IsKeyColumn === true)))) {
                            column.visible = false;
                        }
                    }
                }
            }
        }

        // hack to hide horizontal scrollbar that sometimes appears when not needed
        setTimeout(() => this.wjFlexGrid.autoSizeRows(), 1000);
    }


    hyperLinkCellClicked(cell, columnName) {
        var hyperLinkEventArgs = {
            row: cell.item,
            clickedColumnName: columnName
        };
        this.hyperLinkCellClickedEvent.emit(hyperLinkEventArgs);
    }

    private getIconName(row): string {
        return 'fa fa-fw fa-lg ' + AppFunctions.traverseModelForProperty(row.item, this.iconPropertyName);
    }

    private getCellValue(dataObject: any, columnName: string, datatype: any): any {
        let value = AppFunctions.traverseModelForProperty(dataObject, columnName);
        if (datatype == 'currency' && typeof value === 'number') {
            return wjcCore.Globalize.formatNumber(value, 'n2');
        } else if (datatype == 'percentage' && typeof value === 'number') {
            return wjcCore.Globalize.formatNumber(value, 'n3');
        } else {
            return value
        }
    };


    onDelete(rowObject) {
        this.deleteRowObject = rowObject;
        this.notificationService.confirm(this.theDeleteCallback, 'Are you sure you want to delete?');
    }

    onFilterApplied(eventArgs) {
        let filteredRowsIds = [];
        let pageSize = this.gridData.pageSize;
        let pageIndex = this.gridData.pageIndex;
        this.gridData.pageSize = this.gridData.totalItemCount;
        let items = this.gridData.items;
        for (let item of items) {
            if (item && item.Id) {
                filteredRowsIds.push(item.Id);
            }
        }
        this.gridData.pageSize = pageSize;
        this.gridData.moveToPage(pageIndex);
        this.filteredRowsIdsChange.emit(filteredRowsIds);
    }

    private deleteCallback() {
        this.delete.emit(this.deleteRowObject);
        if (this.selectedRowObject && this.selectedRowObject.Id == this.deleteRowObject.Id) {
            this.selectedRowObject = null;
        }

    }

    autoSizeRows() {
        setTimeout(() => this.wjFlexGrid.autoSizeRows(), 0);
    }

    /*Workaround until Wijmo fixes for Edge IE Firefox and Tablet - wijmo.com/topic/frozencolumns-not-working-as-expected-in-firefox/ */
    initialized() {
        this.wjFlexGrid._useFrozenDiv = function () {
            return false;
        };
    };

    updatedView(eventArgs) {
        if (this.showMultiSelect == true) {
            this.setCheckedRowsCss(this.wjFlexGrid.rows);
        }
        this.setCriticalItemHighlisgtedRows();
        if (this.isDisableSelectedRows && this.iconPropertyName) {
            //to apply disabling class on HTML for the row
            for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
                if (this.wjFlexGrid.rows[i]._data[this.iconPropertyName] === 'row-disabled') {
                    this.wjFlexGrid.rows[i].cssClass = 'row-disabled';
                }
            }
        }
        if (this.isTreeViewHierarchicalData == false) {
            this.gridDataViewChanged.emit({ gridViewData: this.gridData._view });
            if (this.savedPagingAndFilteringKey === '' || this.gridData.items.length === 0) {
                return;
            }
            let sortDescriptions = [];
            this.gridData.sortDescriptions.forEach(sortDescription => {
                sortDescriptions.push({
                    property: sortDescription.property,
                    ascending: sortDescription.ascending
                });
            });

            let filter = this.gridData.filter;
            let f = this.wjFlexGrid;

            let savedInfo = {
                pageIndex: this.gridData.pageIndex,
                pageSize: this.gridData.pageSize,
                sortDescriptions: sortDescriptions,
                filter: this.wjFlexGridFilter.filterDefinition
            }
            this.savedPagingAndFiltering = JSON.stringify(savedInfo);
        }
       
    }

    selectRow(itemObject, rowObject): void {
        if (this.isDisableSelectedRows) {
            //to apply disabling class for the row selected
            this.selectedRowObject = itemObject;
            rowObject.cssClass = 'row-disabled';
            this.selectedRow.emit(itemObject);
        }
        else {
            this.wjFlexGrid.beginUpdate();
            for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
                this.wjFlexGrid.rows[i].cssClass = '';
            }
            this.wjFlexGrid.endUpdate();
            this.selectedRowObject = itemObject;
            rowObject.cssClass = 'row-selected'
            this.selectedRow.emit(itemObject);
        }
    }

    rowClicked(itemObject): void {

        let rowObject = this.wjFlexGrid.rows.filter(x => x._data.Id == itemObject.Id)[0];

        if (rowObject != null && rowObject._data.Disabled) {
            rowObject._data.Disabled = !rowObject._data.Disabled;
        }

        this.selectedRow.emit(itemObject);
    }

    additionalRowAction(itemObject): void {
        this.rowAction.emit(itemObject);
    }

    checkBoxClicked(itemObject, rowObject) {
        this.wjFlexGrid.beginUpdate();
        if (this.numberOfRowSelection != undefined && this.numberOfRowSelection != null && this.numberOfRowSelection != 0 && (rowObject.isSelected == undefined || rowObject.isSelected == false) && this.numberOfRowSelection == this.selectedRowsIds.length) {
            return;
        }

        itemObject['isSelected'] = !rowObject.isSelected;
        rowObject.isSelected = !rowObject.isSelected;
        rowObject.cssClass = rowObject.isSelected ? 'row-selected' : '';
        this.wjFlexGrid.endUpdate();
        //Reverting the code itemObject to itemObject.Id otherwise it's Impacted the whole Application 
        if (itemObject.Id != undefined) {
            if (rowObject.isSelected) {
                this.selectedRowsIds.push(itemObject.Id);
            }
            else {
                this.removeCheckedRow(itemObject.Id);
                if (this.selectedRowsIds.length === 0) {
                    this.clearChecked.emit();
                }
            }
        }
        if (!this.showSelectRow) {
            this.selectedRow.emit();
        }
        this.selectedRowsIdsChange.emit(this.selectedRowsIds);
        if (!this.isSearchAndSelect) {
            this.checkedRow.emit(itemObject);
        }
        else {
            var selectedRows: any[] = [];
            selectedRows.push(rowObject)
            this.checkedRow.emit(selectedRows);
        }

    }

    pageLengthChanged(newPageLength) {
        this.isChecked = false;
        this.initalPageLength = newPageLength;

        this.pageLength = Number(newPageLength);
        this.pageLengthChange.emit(this.pageLength);

        if (this.isSearchAndSelect) {
            this.setCheckedRows(null);
        }
        else {
            for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
                this.wjFlexGrid.rows[i].cssClass = '';
                this.wjFlexGrid.rows[i].isSelected = false;
            }
            for (let i = 0; i < this.selectedRowsIds.length; i++) {
                var rowObject = this.wjFlexGrid.rows.find(x => x._data.Id == this.selectedRowsIds[i]);
                if (rowObject != undefined) {
                    rowObject.cssClass = 'row-selected';
                    rowObject.isSelected = true;
                    this.isChecked = true;
                }
            }
        }
    }
    removeCheckedRow(id): void {
        let index = this.selectedRowsIds.indexOf(id);
        if (index > -1) {
            this.selectedRowsIds.splice(index, 1);
        }
    }

    renderColumnValue(dataObject: any, columnName: string) {
        let value = AppFunctions.traverseModelForProperty(dataObject, columnName);
        if (!!value && typeof value === 'string') {
            value = value.replace(/\r\n/g, '<br/>');
        }
        return value;
    }

    pageChanged(newPageIndex: number) {
        this.isChecked = false;
        this.wjFlexGrid.beginUpdate();
        for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
            this.wjFlexGrid.rows[i].cssClass = '';
            this.wjFlexGrid.rows[i].isSelected = false;
        }
        for (let i = 0; i < this.selectedRowsIds.length; i++) {
            var rowObject = this.wjFlexGrid.rows.find(x => x._data.Id == this.selectedRowsIds[i]);
            if (rowObject != undefined) {
                rowObject.cssClass = 'row-selected';
                rowObject.isSelected = true;
                this.isChecked = true;
            }
        }
        this.wjFlexGrid.endUpdate();
        this.pagingChange.emit(newPageIndex);
    }

    clearCheckedRows(): void {
        this.wjFlexGrid.beginUpdate();
        for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
            var rowObject = this.wjFlexGrid.rows[i];
            var itemObject = this.wjFlexGrid.rows[i]._data;
            rowObject.isSelected = false;
            itemObject['isSelected'] = false;
            rowObject.cssClass = '';
            this.removeCheckedRow(itemObject.Id);
            if (this.selectedRowsIds.length === 0 && !this.isSearchAndSelect) {
                this.clearChecked.emit();
            }
        }
        this.wjFlexGrid.endUpdate();
        this.selectedRowsIdsChange.emit(this.selectedRowsIds);
        if (this.isSearchAndSelect) {
            (this.selectedRowsIds.length === 0) ? this.clearChecked.emit([]) : this.clearChecked.emit(this.wjFlexGrid.rows);
        }
    }

    checkVisible(): void {
        let allCheckedRows = [];
        this.wjFlexGrid.beginUpdate();
        for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
            var rowObject = this.wjFlexGrid.rows[i];
            var itemObject = this.wjFlexGrid.rows[i]._data;
            //Reverting the code itemObject to itemObject.Id otherwise it's Impacted the whole Application 
            this.removeCheckedRow(itemObject.Id);//Remove ItemObject 

            rowObject.isSelected = true;
            itemObject['isSelected'] = true;
            rowObject.cssClass = 'row-selected';
            //Reverting the code itemObject to itemObject.Id otherwise it's Impacted the whole Application 
            if (itemObject.Id) {
                this.selectedRowsIds.push(itemObject.Id);
            }
            allCheckedRows.push(itemObject);
        }
        this.wjFlexGrid.endUpdate();
        this.selectedRowsIdsChange.emit(this.selectedRowsIds);
        if (!this.isSearchAndSelect) {
            this.checkedRow.emit(allCheckedRows);
        }
        else {
            this.checkedRow.emit(this.wjFlexGrid.rows);
        }
    }

    setSelectedRow(rowIndex: number) {
        if (this.wjFlexGrid.rows != undefined && this.wjFlexGrid.rows[rowIndex] != undefined && this.wjFlexGrid.rows[rowIndex].cssClass != undefined) {
            this.wjFlexGrid.rows[rowIndex].cssClass = 'row-selected';
        }
        if (this.wjFlexGrid.rows != undefined && this.wjFlexGrid.rows[rowIndex] != undefined && this.wjFlexGrid.rows[rowIndex].isSelected != undefined) {
            this.wjFlexGrid.rows[rowIndex].isSelected = true;
        }
        this.wjFlexGrid.scrollIntoView(rowIndex, 0);
    }

    private getFormat(dataType, columnType, format) {
        // These formats are applicable to the Wijmo column format
        let result = format;
        if (dataType != null) {
            switch (dataType) {
                case 'date':
                    result = 'MM/dd/yyyy';
                    break;
                case 'time':
                    result = 'hh:mm tt';
                    break;
                case 'datetime':
                    result = 'MM/dd/yyyy hh:mm:ss tt';
                    break;
                case 'integer':
                case 'number:noformat':
                case 'number:basispoints':
                    result = 'D1';
                    break;
                case 'currency:0':
                    result = 'C0';
                    break;
                case 'currency:2':
                    result = 'C2';
                    break;
            }
        }
        else if (columnType != null) {
            let columnDataType = this.getDataType(dataType, columnType);
            if (columnDataType == wjcCore.DataType.Date) {
                result = 'MM/dd/yyyy hh:mm:ss tt';
            }
        }
        return result;
    }

    private getDataType(dataType, columnType) {
        let result = wjcCore.DataType.String;
        if (dataType != null) {
            switch (dataType) {
                case 'date':
                case 'time':
                case 'datetime':
                    result = wjcCore.DataType.Date;
                    break;
                case 'integer':
                case 'numeric':
                    result = wjcCore.DataType.Number;
                    break;
                case 'boolean':
                case 'booleanRedX':
                    result = wjcCore.DataType.Boolean;
                    break;
            }
        }
        else if (columnType != null) {
            switch (columnType) {
                case 'datetime':
                    result = wjcCore.DataType.Date;
                    break;
                case 'integer':
                case 'numeric':
                    result = wjcCore.DataType.Number;
                    break;
                case 'boolean':
                case 'booleanRedX':
                    result = wjcCore.DataType.Boolean;
                    break;
            }
        }
        return result;
    }

    private setRows(newRows: any[]) {
        // Hack to create date objects for ISO Json Dates, hate this!
        if (newRows != null) {
            newRows.forEach((row, rowIndex) => {
                var records = this.columns.filter(x => x.ColumnName.includes('/'));
                for (let index = 0; index <= records.length - 1; index++) {
                    row[records[index].ColumnName] = this.renderColumnValue(row, records[index].ColumnName);
                }
                for (let property in row) {
                    let value = this.renderColumnValue(row, property);
                    let renderColumn = (this.columns.length > 0) ? this.columns.find(x => x.ColumnName === property) : null;
                    var dataType = renderColumn != null ? renderColumn.DataType : null;
                    if (value != null && value != '' && dataType != null) {
                        switch (dataType) {
                            case 'currencynegativewithparentheses':
                                row[property] = value.toString().charAt(0) == '-' ? '(' + value.toString().substring(1, value.toString().length) + ')' : value.toString();
                                break;
                            case 'time':
                            case 'datetime':
                                {
                                    row[property] = moment.utc(value, moment.ISO_8601).toDate();
                                    break;
                                }
                            case 'date':
                                {
                                    // This doesn't work because moment.ToDate() converts the UTC value to the local timezone when the .ToDate() occurs. 
                                    // moment always keeps the timezone information when converting to a JavaScript date, since it wouldn't be the same date otherwise
                                    //row[property] = moment(value).toDate();

                                    // We actually want to "lose" the current timezone information and just have a Date object without the timezone offset
                                    // (technically, the native JavaScript date object always has a timezone, this is a hackaround)

                                    // use the JavaScript Date constructor that doesn't take in Timezone information.
                                    let momentValue = moment.utc(value, moment.ISO_8601);
                                    row[property] = new Date(momentValue.format("MM/DD/YYYY"));
                                    break;
                                }
                        }
                    }
                    else {
                        if (value == null) {
                            row[property] = '';
                        }
                    }
                }
            });
        }
        // End Hack
        let collectionView = new wjcCore.CollectionView(newRows);
        collectionView.pageSize = this.pageLength;
        let groupColumns: any[] = [];
        if (this.columns) {
            groupColumns = (this.childItemsPath != undefined && this.childItemsPath != null)
                ? this.columns.filter(x => x.ColumnName == this.childItemsPath)
                : this.columns.filter(x => x.IsGroupColumn == true);
            if (groupColumns.length > 0) {
                groupColumns.forEach(function (column) {
                    collectionView.groupDescriptions.push(new wjcCore.PropertyGroupDescription(column.ColumnName));
                });
            }
        }
        this.gridData = collectionView;
        this.gridData.currentItem = null;
        if (this.childItemsPath != undefined && this.childItemsPath != null) {
            this.isTreeView = true;
            this.gridData = this.getTreeData(collectionView);
        }
        if (this.savedPagingAndFilteringKey !== '' && this.savedPagingAndFiltering != null) {
            let savedInfo = JSON.parse(this.savedPagingAndFiltering);

            if (savedInfo.pageSize != null) {
                this.initalPageLength = savedInfo.pageSize;
            }

            if (savedInfo.filter != null) {
                this.wjFlexGridFilter.filterDefinition = savedInfo.filter;
            }

            if (savedInfo.sortDescriptions != null && savedInfo.sortDescriptions.length > 0) {
                savedInfo.sortDescriptions.forEach(sortDescription => {
                    this.gridData.sortDescriptions.push(new wjcCore.SortDescription(sortDescription.property, sortDescription.ascending));
                });
            }

            this.gridData.moveToPage((savedInfo.pageIndex != null) ? savedInfo.pageIndex : 0);
        }

        if (this.rows) {
            wjcCore.Control.invalidateAll(this.wjFlexGrid);
        }
        if (this.gridData.totalItemCount > 0) {
            this.hasData = true;
        }
    }

    private getTreeData(collectionView: any) {
        let tree: any[] = [];
        for (let i = 0; i < collectionView._fullGroups.length; i++) {
            let record = {
                [this.childItemsPath]: collectionView._fullGroups[i].name,
                childItemsPath: collectionView._fullGroups[i].items
            }
            tree.push(record);
        }
        return (new wjcCore.CollectionView(tree));
    }
    public getGridFilterdData() {
        return this.gridData.items;
    }

 public setCriticalItemHighlisgtedRows() {
     var rowObject = this.wjFlexGrid.rows.filter(x => x._data != undefined && x._data.IsCritical != undefined && x._data.IsCritical === 'Yes');
     if (rowObject != undefined && rowObject != null && rowObject.length > 0) {
         for (let i = 0; i < rowObject.length; i++) {
             rowObject[i].cssClass = 'row-selected';
         }
     }
          
    }

    public setCheckedRows(rows: any) {
        this.isChecked = false;
        this.selectedRowsIds = this.checkedRowIds;
        for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
            this.wjFlexGrid.rows[i].cssClass = '';
            this.wjFlexGrid.rows[i].isSelected = false;
        }
        for (let i = 0; i < this.checkedRowIds.length; i++) {
            rows = (rows !== null) ? rows : this.wjFlexGrid.rows
            var rowObject = this.wjFlexGrid.rows.find(x => x._data.Id == this.checkedRowIds[i]);
            if (rowObject != undefined) {
                rowObject.cssClass = 'row-selected';
                rowObject.isSelected = true;
                this.isChecked = true;
            }
        }
    }

    private setCheckedRowsCss(rows: any[]) {
        if (this.selectedRowsIds.length == 0 && this.selectedRowObject == null) {
            for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
                this.wjFlexGrid.rows[i].cssClass = '';
                this.wjFlexGrid.rows[i].isSelected = false;
            }
        }

        for (let i = 0; i < this.selectedRowsIds.length; i++) {
            var rowObject = rows.find(x => x._data.Id == this.selectedRowsIds[i]);
            if (rowObject != undefined) {
                rowObject.cssClass = 'row-selected';
                rowObject.isSelected = true;
            }
        }
    }

    private wrapDescription(column: any) {
        let row = this.wjFlexGrid.rows.find(x => x._data)
        for (let i = 0; i < this.wjFlexGrid.rows.length; i++) {
            let row = this.wjFlexGrid.rows[i];
            for (let property in row._data) {
                if (column._binding._key == property) {
                    let value = new String(row._data[property]);
                    if (value.includes('<br/>') && column != null) {
                        column.wordWrap = true;
                    }
                }
            }
        }
    }

    openSelections($event: MouseEvent) {
        this.selectionsOpen = !this.selectionsOpen;
        event.preventDefault();
        event.stopPropagation();
    }

    clickOutsideClose() {
        this.selectionsOpen = false;
    }

    public addFooterRow(dataItem) {
        var row = new GroupRow();
        row.dataItem = dataItem;
        //// add the row to the column footer panel
        this.wjFlexGrid.columnFooters.rows.push(row);
    }

    public exportToPdf(Title: string, FileName: string) {
        const fcolumns = this.wjFlexGrid.frozenColumns;
        this.wjFlexGrid.frozenColumns = 0;
        FlexGridPdfConverter.export(this.wjFlexGrid, FileName + '.pdf', {
            scaleMode: ScaleMode.PageWidth,
            maxPages: 1000,
            styles: {
               cellStyle: {
                  backgroundColor: '#ffffff',
                  borderColor: '#c6c6c6'},
               headerCellStyle: {
                  backgroundColor: '#eaeaea'
               }
            },
            documentOptions: {
               info: {
                  title: Title
               }
            }
         });
         this.wjFlexGrid.frozenColumns = fcolumns;
    }

}