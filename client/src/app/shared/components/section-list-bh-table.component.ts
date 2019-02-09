import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/subscription';

import { IFilterOptions } from '../services/pageable-table-service.interface';
import { UnificationAPIService } from '../services/unification.api.service';
import { NotificationService } from '../services/notification.service';
import { AuthRouterService } from '../auth-router.service';
import { AppFunctions } from '../app.functions';

@Component({
    selector: 'bh-section-bh-table-list',
    templateUrl: 'section-list-bh-table.component.html'
})
export class SectionListBhTableComponent implements OnInit {
    @ViewChild('table') public table;
    @Input() isSearchAndSelect: boolean = false;
    @Input() sectionName: string;
    @Input() service: any;
    @Input() columns: any[] = [];
    @Input() showMultiSelect: boolean = false;
    @Input() iconType: string = 'pencil';
    @Input() iconTooltip: string = null;
    @Input() selectedRowsIds: string[] = [];
    @Input() rows: any[] = [];
    @Input() isTreeView: boolean = false;
    @Input() showDeleteColumn: boolean = false;
    @Input() getMethod: string = null;
    @Input() id: string = null;
    @Input() defaultSortColumnName: string = null;
    @Input() isSelectVisible: boolean = false;
    @Output() selectedRow = new EventEmitter();
    @Output() checkedRow = new EventEmitter();
    @Output() selectedRowsIdsChange = new EventEmitter();
    @Output() filteredRowsIdsChange = new EventEmitter();
    @Output() clearChecked = new EventEmitter();
    @Output() delete: EventEmitter<Function> = new EventEmitter<Function>();
    @Output() pagingChange = new EventEmitter();
    @Output() pageLengthChange = new EventEmitter();
    @Output() onRefreshRemoveCheckedRows = new EventEmitter();
    private showAddButton: boolean = false;
    @Input() showSelectRow: boolean = true;
    private showDeleteButton: boolean = false;
    @Input() isLoading: boolean = true;
    @Input() checkedRowIds: any = [];
    private isSort: boolean = false;
    private isDescendingSort: boolean = false;
    private internalSort: any = {
        columnName: null,
        isDescending: false,
        columnReference: null
    };
    @Output() rowsPopulated = new EventEmitter();
    itemsToEnable: any = [];
    @Input() numberOfRowSelection: number = null;

    @Output() onGetData = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        protected baseService: UnificationAPIService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private authRouter: AuthRouterService) {

    }

    ngOnInit() {
        this.getData();
    }

    onRefresh($event) {
        this.getData();
        this.onRefreshRemoveCheckedRows.emit($event);
    }

    getData() {
        this.onSelectedRowsIdsChange([]);
        this.isLoading = true;
        if (this.service == undefined && this.columns.length==0) {
            this.isLoading = false;
            throw new TypeError('You have wired up a section route but failed to provide a service to get data.');
        }
        if (this.service != undefined) {
            this.columns = this.service.columns;
            let column = this.columns.find(c => !c.IsGroupColumn && !c.IsKeyColumn);
            this.internalSort.columnName = this.defaultSortColumnName;

            if (this.getMethod != null) {
                // use the override
                this.service[this.getMethod](this.id)
                    .subscribe(this.getDataCallback.bind(this), this.getDataError.bind(this));
            }
            else {
                //otherwise, use the default getPage method of the PagingService
                let filterOptionDefaults = <IFilterOptions>{
                    columnFilters: [],
                    sort: this.internalSort,
                    skip: 0,
                    take: 0,
                    globalFilter: ''
                };
                this.service.getPage(filterOptionDefaults)
                    .subscribe(this.getDataCallback.bind(this), this.getDataError.bind(this));
            }
        } else {
            this.isLoading = false;
        }
    }

    getDataCallback(data: any) {
        let rows = data.value ? data.value : data;
        for (let row of rows) {
            delete row['@odata.type'];
        }
        this.rows = rows;
        this.isLoading = false;
        this.onGetData.emit();
    }
    getDataError(error) {
        this.isLoading = false;
    }

    onCheckedRow(checkedRow) {
        this.checkedRow.emit(checkedRow);
    }

    onClearChecked(e) {
        this.clearChecked.emit(e);
    }

    onSelectedRowsIdsChange(e) {
        this.selectedRowsIdsChange.emit(e);
    }

    onFilteredRowsIdsChange(e) {
        this.filteredRowsIdsChange.emit(e);
    }

    onSelectedRow(selectedRow) {
        this.selectedRow.emit(selectedRow);
    }

    onDelete($event) {
        this.delete.emit($event);
    }
    filterSelectedRows($event) {
        this.rowsPopulated.emit($event);
    }

    private isRowSelected(id: any): boolean {
        var selectedId = this.checkedRowIds.find(x => x == id);
        if (selectedId != undefined) {
            return true
        }
        return false;
    }


    onSort() {
        let order: any;
        this.isDescendingSort = !this.isDescendingSort;
        this.rows.sort((a, b) => {
            order =
                AppFunctions.compare(
                    this.isRowSelected(a.Id),
                    this.isRowSelected(b.Id),
                    true);
            if (order != 0)
                return order;
            return 0;
        });
        this.isLoading = true;
        setTimeout(() => this.isLoading = false, 5);
    }

    onPageNumberChange($event) {
        this.pagingChange.emit($event);
    }
    onPageLengthChange($event) {
        this.pageLengthChange.emit($event);
    }
}