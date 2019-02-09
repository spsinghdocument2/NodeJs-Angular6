import { Component, Input, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/subscription';

import { IFilterOptions } from '../services/pageable-table-service.interface';
import { ISectionListActionListProvider } from './section-list-action-list-provider.interface';
import { Observable } from 'rxjs/Observable';
import { UnificationAPIService } from '../services/unification.api.service';
import { NotificationService } from '../services/notification.service';
import { AuthRoute } from '../auth-route';
import { AuthRouterService } from '../auth-router.service';
//import { ExportToExcelComponent } from '../components/export-to-excel.component';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import {   OdataTableService, OdataTreeService} from '../../shared';
import { IPageableTableService } from '../services/pageable-table-service.interface'
import { AppFunctions } from '../app.functions';
@Component({
    selector: 'bh-section-list',
    templateUrl: 'section-list.component.html'
})
export class SectionListComponent implements OnInit {
    @Input() isTemplateRunList: boolean = false;
    @Input() sectionName: string;
    @Input() service: any;
    @Input() navigateRoute: AuthRoute = null;
    @Input() navigateNewRoute: AuthRoute = null;    
    @Input() navigateManageTies: AuthRoute = null;
    @Input() id: string;
    @Input() serviceOptions: any;
    @Input() actionListProvider: ISectionListActionListProvider = null;
    @Input() actions: any[] = [];
    @Input() isMultiSelect: boolean;
    @Input() isModalFilterOptionEnabled: boolean;
    @Input() iconType: string = 'pencil';
    @Input() iconTooltip: string = 'View/Edit Details';
    @Input() hasSelectAllCheckBoxItem: boolean;
    @Input() hasSelectCheckBoxItem: boolean;
    @ViewChild('dialogPopup') private exportToExcelModal;
    private filterOptions: any;
    @Input() innerControlType: string = 'bhtable';     
    @ViewChild('results') results;
    @ViewChild('table') table;
    @Input() deleteMethod: string = null;
    @Input() getMethod: string = null;    
    @Input() showAdd: boolean = true;
    @Input() showCloseButton: boolean = false;
    @Input() showKey: boolean = false;
    @Input() showKeyDisabled: boolean = true;
    @Output() clearChecked = new EventEmitter();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    @Output() run: EventEmitter<any> = new EventEmitter<any>();
    @Output() filterChange = new EventEmitter();
    @Output() checkRow = new EventEmitter();
    @Output() resetRecordCount = new EventEmitter();
    @Output() selectedRowsIdsChange = new EventEmitter();
    @Output() onRefreshRemoveCheckedRows = new EventEmitter();
    @Output() onGetData = new EventEmitter();
    private showAddButton: boolean = false;
    private showEditButton: boolean = false;
    private showDeleteButton: boolean = false;
    private isLoading: boolean = false;
    public columnList: any;
    private enableModel: boolean = false;
    private pageLength: number = 10;
    private pageNumber: number = 1;
    selectedRowIds: any = [];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        protected baseService: UnificationAPIService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private authRouter: AuthRouterService) {
    }

    ngOnInit() {
        if (this.service != undefined && this.service.setServiceOptions !== undefined) {
            this.service.setServiceOptions(this.serviceOptions);
        }
        if (this.service != undefined && this.service.getConstantFilter !== undefined) {
            this.service.odataConstFilter = this.service.getConstantFilter(this.id);
        }
        if (this.service != undefined && this.service.showAddButton !== undefined) {
            this.showAddButton = this.navigateNewRoute && this.service.showAddButton();          
        }                        
        this.showEditButton = this.navigateRoute != null && this.navigateRoute.primary != null && this.navigateRoute.primary.length > 0;
        this.showDeleteButton = (this.deleteMethod != null && this.deleteMethod != undefined );
        if (this.iconType == undefined || this.iconType == null) {
            this.iconType='pencil'
        }
        if (this.hasSelectAllCheckBoxItem  || this.hasSelectCheckBoxItem )
        {
            this.isMultiSelect = true;
        }
    }

    exportToExcel(anchor) {
        this.enableModel = (this.isModalFilterOptionEnabled) ?
            this.exportToExcelModal.show(this.service, this.sectionName, this.pageLength, this.pageNumber, this.isModalFilterOptionEnabled, this.getMethod, this.id) :
            this.exportToExcelModal.hide(this.service, this.sectionName, this.getMethod, this.id);
        if (this.isModalFilterOptionEnabled) {
            return true;
        }
        else {
            this.exportToExcelModal.onExportToFileClick(null);
        }
    }

    selectedRow(selectedRow) {
        if (!selectedRow)
            return;

        // Check for the existance of a IsKeyColumn: true
        let keyColumns = this.service.columns.filter(x => x.IsKeyColumn === true);

        let keyColumn: any = (keyColumns.length > 0) ? keyColumns[0] : undefined;

        let rowId = null;
        // Use the keyColumn
        if (keyColumn !== undefined) {
            rowId = AppFunctions.traverseModelForProperty(selectedRow, keyColumn.ColumnName);
        }
        // or use the Id column
        else if (selectedRow.Id) {
            rowId = selectedRow.Id
        }
        // otherwise we don't know what to do; do nothing
        else {
            console.error("We couldn't find the key column, nor an Id column on the row.  Aborting row click...");
            return;
        }

        if (this.navigateRoute != null) {
            let clone: AuthRoute = new AuthRoute();
            if (this.navigateRoute.primary != null) {
                let primary = AppFunctions.stringReplaceAll(this.navigateRoute.primary, ':id', rowId);
                primary = AppFunctions.stringReplaceAll(primary, ':parentid', this.id);
                clone.primary = primary;
            }
            if (this.navigateRoute.section) {
                let section = AppFunctions.stringReplaceAll(this.navigateRoute.section, ':id', rowId);
                section = AppFunctions.stringReplaceAll(section, ':parentid', this.id);
                clone.section = section;
            }
            this.authRouter.navigate(clone);
        }
    }

    addNew() {
        let clone: AuthRoute = new AuthRoute();
        if (this.navigateNewRoute.primary) {
            clone.primary = this.navigateNewRoute.primary.replace(':id', this.id);
        }
        if (this.navigateNewRoute.section) {
            clone.section = this.navigateNewRoute.section.replace(':id', this.id);
        }
        this.authRouter.navigate(clone);
    }

    manage() {
        let clone: AuthRoute = new AuthRoute();
        if (this.navigateManageTies.primary) {
            clone.primary = this.navigateManageTies.primary.replace(':id', this.id);
        }
        if (this.navigateManageTies.section) {
            clone.section = this.navigateManageTies.section.replace(':id', this.id);
        }
        this.authRouter.navigate(clone);

    }

    getActions(): ISectionListActionListProvider[] {
        if (this.actionListProvider && this.actionListProvider.actions && this.actionListProvider.actions.length > 0) {
            return this.actionListProvider.actions;
        }
        else {
            if (this.actions) {
                return this.actions;
            }
            else {
                return [];
            }
        }
    }

    onPageLengthChange(newPageLength) {
        this.pageLength = Number(newPageLength);
    }
    pageNumberChange(newPageNumber) {
        this.pageNumber = Number(newPageNumber);
        this.resetRecordCount.emit(); 
    }

    onFilterChange($event) {
        this.filterChange.emit($event);
    }

        onDelete($event) {
            let deleteMethod = this.deleteMethod;
            let subscription = this.service[deleteMethod]($event.Id)
                .subscribe(result => {
                    this.notificationService.success("Deleted");
                    this.results.onRefresh();
                });
        }

    onRefresh($event) {
        this.selectedRowIds = [];
        this.results.onRefresh();
        }

    RefreshList($event) {
        this.onRefreshRemoveCheckedRows.emit($event);
    }

    onSelectedRowsIdsChange(selectedRowIds: string[]) {
        this.selectedRowIds = selectedRowIds;
        this.selectedRowsIdsChange.emit(this.selectedRowIds);
        if (this.actionListProvider != undefined && this.actionListProvider != null) {
            this.actionListProvider.enableDisableAction(this.selectedRowIds, this.actionListProvider);
        }
    }

    onRowChecked(selectedRow) {
        this.checkRow.emit(selectedRow);
    } 

    onClearChecked(e) {
        this.selectedRowIds = [];
        this.clearChecked.emit(e);
    } 

    onClose() {
        this.close.emit();
    }

    onRunTemplate() {
        this.run.emit();
    }

    onGetDataFunc() {
        this.onGetData.emit();
    }
}