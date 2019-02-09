// import { Component, OnInit, OnDestroy, ViewChildren, ViewChild, Output, EventEmitter, HostListener, Input } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

// import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/observable/forkJoin';
// var moment = require('moment');
// import { AppSettings } from '../../../app.globals';
// import {

//     BhControl,
//     DetailsFormBaseComponent,
//     DictionaryService,
//     IColumnSearch,
//     NavigationService,
//     DocumentModel,
//     DocumentAPIService,
//     NotificationService,
//     UnificationAPIService,
//     DocumentPreparationTabsComponent
// } from '../index';
// import { AppFunctions } from '../app.functions';
// import { IQueryActionListProvider, NullActionListProvider } from './query-action-list-provider';
// import { AuthRoute } from '../../auth-route';
// import { AuthRouterService } from '../../auth-router.service';
// import { PagingService } from '../../services/paging.service';
// import { TableRComponent } from '../../controls/reactive/bh-r-table.component';
// import { QueryAPIService } from '../queries/query.api.service';
// import { QueryExportModel } from './query-export.model';
// import { TrackingItemsAPIService } from '../../../crm/clients/tracking-items/tracking-items.api.service';
// import { UserFlyOutAPIService } from '../queries/user-flyout.api.service';
// import { UserModel } from '../../../shared/models/UserModel';
// import { QueryUserSecurityAPIService } from '../../../shared/common/queries/query-usersecurity.api.service';
// import { DealSearchAPIService } from '../../../admin/manage/template/deal-search.api.service';
// import { ClientSearchAPIService } from '../../../shared/common/client/client-search.api.service';
// import { ProductSearchAPIService } from '../../../admin/manage/template/product-search.api.service';
// import { OpportunitySearchAPIService } from '../../../admin/manage/template/opportunity-search.api.service';
// import { TrackingItemSearchAPIService } from '../../../admin/manage/template/tracking-item-search.api.service';
// import { ClientContactAPIService } from '../../../admin/manage/template/client-contacts.api.service';
// import { ContactAddressAPIService } from '../../../admin/manage/template/contact-addresses.api.service';
// import { TemplatePreviewModel } from '../../../admin/manage/template/template-preview.model';
// import { DataSourceModel } from '../../../admin/manage/template/data-source.model';
// import { OpportunityDetailsApiService } from '../../../lending/opportunities/opportunity-details.api.service';
// import { ProfitabilityCalculationApiService } from '../../../lending/opportunities/profitability-calculation/profitablity-calculation.api.service';
// import { ClientProductsAPIService } from '../../../shared/common/products/products.api.service';
// import { ApplicationSecurityService } from '../../services/application-security.service';

// @Component({
//     selector: 'query-list',
//     templateUrl: 'app/shared/common/query-list/query-list.component.html',
//     providers: [QueryAPIService, TrackingItemsAPIService, QueryUserSecurityAPIService, ClientProductsAPIService, DocumentAPIService, ClientContactAPIService, ProfitabilityCalculationApiService, ContactAddressAPIService, OpportunityDetailsApiService, ContactAddressAPIService, ClientSearchAPIService, DealSearchAPIService, ProductSearchAPIService, OpportunitySearchAPIService, TrackingItemSearchAPIService]
// })
// export class QueryListComponent extends DetailsFormBaseComponent implements OnInit, OnDestroy {

//     @ViewChild(TableRComponent) private resultsGrid: TableRComponent;
//     @ViewChild('datasource') private dataSource;
//     @ViewChild('contactList') private contactList;
//     @ViewChild('contactListGrid') private contactListGrid;
//     @ViewChild('addressListGrid') private addressListGrid;
//     @ViewChild('documentPreparationTab') documentPreparationTabs: DocumentPreparationTabsComponent;
//     @ViewChild('dealList') private dealList;
//     @ViewChild('previewModal') private previewModal;
//     private showDocPrepModal: boolean = true;
//     private selectedEntityIds: string[] = [];
//     private isCloseModal: boolean = false;
//     private isComponentShownInModel: boolean = false;
//     private dateOptions: any[] = [];
//     private isPreviewForDocPrep: boolean = false;
//     private disableDefault: boolean = true;
//     private defaultOutTypeOptions: any = [];
//     private isFormReady: boolean = true;
//     private format: string = null;
//     @ViewChild('pdrModel') private pdrModel;
//     private showDocPrep: boolean = true;
//     private isRelativeDate: boolean = false;
//     private clientId: string = null;
//     private month: number = 0;
//     private paramId: string = null;
//     private contactId: string = '00000000-0000-0000-0000-000000000000';
//     private contactAddressId: string = '00000000-0000-0000-0000-000000000000';
//     private isAllowDownload: boolean = true;
//     private loadGrid: boolean = true;
//     private storageKey: string;
//     private storage: Storage;
//     private state: QueryListState = new QueryListState();
//     private downloadToken: string = null;
//     private dataSourceModel: DataSourceModel = new DataSourceModel();
//     private model: QueryExportModel = new QueryExportModel();
//     private OpportunityReasonResult: any = [];
//     private userSecurityAccessLevelDataRows: any[] = [];
//     private contextCategoryBHCode: string = null;
//     private contextTypeBHCode: string = null;
//     hasUpdateAll: boolean = false;
//     selectedQueryId: string = '';
//     queryOptions: any[];
//     queryOptionsLoading: boolean = false;
//     isMultiSelect: boolean = true;
//     title: string = null;
//     pagingService: PagingService = new PagingService();
//     queryListLoading: boolean = true;
//     columns: any[] = [];
//     rows: any;
//     hasCheckedRows: boolean = false;
//     actionProvider: IQueryActionListProvider = null;
//     setActiveButtonEvent: EventEmitter<boolean> = new EventEmitter();
//     queryDataProviderBHCode: string = null;
//     queryModifierCode: string = 'MANAGEPAGES';
//     selectedRowIds: any = [];
//     filteredRowIds: any = [];
//     private interval: any = [] = [
//         { "Id": "Days", "Label": "Days" },
//         { "Id": "Months", "Label": "Months" },
//         { "Id": "TotalsOnly", "Label": "Totals only" },
//         { "Id": "Weeks", "Label": "Weeks" }
//     ];
//     private pdrForm: FormGroup;
//     queryHasRun: boolean = false;
//     private defaultSortColumn: any = null;
//     private contactAddressService: any = null;
//     @Input() queryActions: any = [];
//     @Input() recentGroupName: string = '';
//     @Input() showBusinessRule: boolean = false;
//     @Input() showDecisionRule: boolean = false;
//     @Input() showControlInMoreAction: boolean = false;
//     @Input() showCreateTemplate: boolean = false;
//     @Input() showSelectRow: boolean = true;

//     @Output() selectedRowIdsChange: EventEmitter<any> = new EventEmitter<any>();
//     @Output() pagingChange = new EventEmitter();
//     @Output() queryChange: EventEmitter<any> = new EventEmitter<any>();
//     @Output() checkRow = new EventEmitter();
//     @Output() businessRule = new EventEmitter();
//     @Output() decisionRule = new EventEmitter();
//     @Input() searchAndSelectService: any = null;
//     @Output() createTemplate = new EventEmitter();
//     public theDeleteCallback: Function;
//     public currentUser: UserModel = new UserModel();
//     private modifyAccessRows: any[] = [];
//     private isAllowModifyQuery: boolean = true;
//     private isAllowAddQuery: boolean = false;
//     private isCreateAccess: boolean = false;
//     private documentModel: DocumentModel = new DocumentModel();

//     private modifyQueryId: string;
//     private isDataSourceDisabled: boolean = true;
//     private isSampleDataSourceDisabled: boolean = true;
//     private isPreviewDisabled: boolean = true;
//     private showModal: boolean = true;
//     private previewModel: TemplatePreviewModel = new TemplatePreviewModel();
//     private showPreviewModal: boolean = true;
//     private currentTemplate: any = {};
//     private DataSourceService: any = "";
//     private templateOptions = [];
//     private PreviewForm: FormGroup;
//     private previewModalValid: boolean = false;
//     private samplePreview: boolean = true;
//     private selectedRowByPreview: any;
//     private dataSourceModalTitle: string = "Download Options";
//     private dataSourcebuttonText: string = "Download";
//     private operation: string = null;
//     private isPreview: boolean = false;

//     private opportunityId: string = null;
//     private dealId: string = null;
//     private entityFilterGridList: any;




//     controlList = {
//         pdfColumns: <BhControl>{
//             key: 'ColumnName',
//             label: '',
//             data: { showCheckAll: true, valueSeperator: ',', options: [] }
//         },
//         startDate: <BhControl>
//         {
//             key: 'StartDate',
//             label: 'Start Date',
//             disabled: false,
//             readonly: false,
//             data: {
//                 RadioControl: <BhControl>{
//                     key: 'IsStartDateCalender',
//                     label: '',

//                     data: {
//                         value: 'date',
//                         options: [
//                             { value: 'date', label: 'Enter Date' },
//                             { value: 'options', label: 'Select Option' }
//                         ],
//                         optionsValue: 'value',
//                         optionsText: 'label'
//                     }
//                 },
//                 DateControl: <BhControl>{
//                     key: 'StartDate',
//                     label: ''
//                 },
//                 DropdownControl: {
//                     key: 'StartDateRelativeTypeId',
//                     label: '',
//                     data: {
//                         options: this.dateOptions,
//                     },
//                     disabled: true
//                 }
//             },
//             validators: [Validators.required]
//         },

//         endDate: <BhControl>
//         {
//             key: 'EndDate',
//             label: 'End Date',
//             disabled: false,
//             readonly: false,
//             data: {
//                 RadioControl: <BhControl>{
//                     key: 'IsEndDateCalender',
//                     label: '',

//                     data: {
//                         value: 'date', // default to showing the date control
//                         options: [
//                             { value: 'date', label: 'Enter Date' },
//                             { value: 'options', label: 'Select Option' }
//                         ],
//                         optionsValue: 'value',
//                         optionsText: 'label'
//                     }
//                 },
//                 DateControl: <BhControl>{
//                     key: 'EndDate',
//                     label: ''
//                 },
//                 DropdownControl: {
//                     key: 'EndDateRelativeTypeId',
//                     label: '',
//                     data: {
//                         options: this.dateOptions,
//                     },
//                     disabled: true // default to disabled
//                 }
//             },
//             validators: [Validators.required]

//         },

//         reportInterval: <BhControl>{
//             key: 'Interval',
//             label: 'Report Interval',
//             data: { value: '', options: this.interval },
//             validators: [Validators.required]
//         },
//         dataSourceSearchControl: <BhControl>{
//             key: 'Id',
//             label: '',
//             data: {
//                 propertyNames: {
//                     searchId: 'Id'
//                 },
//                 service: '',
//                 serviceModelTextProperty: 'FullName',
//                 serviceModelValueProperty: 'Id',
//                 serviceGetByIdMethod: 'getById',
//                 disabledValues: []
//             }

//         }
//     }




//     previewControlList = {
//         TemplateOptionControl: <BhControl>{
//             key: 'TemplateOption',
//             label: 'Data Source',
//             data: {
//                 value: this.previewModel.TemplateOption,
//                 inline: true,
//                 options: []
//             },
//             validators: [Validators.required]
//         },
//         CategoryControl: <BhControl>{
//             key: 'ContextId',
//             label: '',
//             data: {
//                 propertyNames: {
//                     searchId: 'ContextId'
//                 },
//                 service: this.clientSearchAPIService,
//                 serviceModelTextProperty: 'FullName',
//                 serviceModelValueProperty: 'Id',
//                 serviceGetByIdMethod: 'getById',
//                 disabledValues: [],
//                 model: this.previewModel,
//                 hideClearSelected: true
//             },
//             validators: [Validators.required]
//         },
//         DefaultOutputTypeControl: <BhControl>{
//             key: 'DocumentOutputTypeId',
//             label: 'Default Output Type',
//             data: { value: this.previewModel.DocumentOutputTypeId, options: [] },
//             validators: [Validators.required]
//         }
//     }

//     constructor(
//         private unificationAPIService: UnificationAPIService,
//         private queryService: QueryAPIService,
//         private baseService: UnificationAPIService,
//         private queryRoleService: QueryUserSecurityAPIService,
//         protected router: Router,
//         private dictionaryService: DictionaryService,
//         private activatedRoute: ActivatedRoute,
//         protected notificationService: NotificationService,
//         protected navigationService: NavigationService,
//         private formBuilder: FormBuilder,
//         private authRouter: AuthRouterService,
//         private trackingItemsService: TrackingItemsAPIService,
//         private clientSearchAPIService: ClientSearchAPIService,
//         private dealSearchAPIService: DealSearchAPIService,
//         private productSearchAPIService: ProductSearchAPIService,
//         private opportunitySearchAPIService: OpportunitySearchAPIService,
//         private trackingItemSearchAPIService: TrackingItemSearchAPIService,
//         private clientContactAPIService: ClientContactAPIService,
//         private documentAPIService: DocumentAPIService,
//         private opportunityDetailsApiService: OpportunityDetailsApiService,
//         private profitabilityCalculationApiService: ProfitabilityCalculationApiService,
//         private clientProductsAPIService: ClientProductsAPIService,
//         private applicationSecurityService: ApplicationSecurityService
//     ) {
//         super(notificationService, navigationService);

//         this.addSubscription =
//             router.events
//                 .filter(event => event instanceof NavigationStart)
//                 .subscribe(() => {
//                     this.saveSessionState();  // save vertical scroll position
//                 });

//         this.currentUser = JSON.parse(this.baseService.currentUser);
//     }

//     canDownload(): boolean {
//         this.onDateOptionChange();
//         let model = this.pdrForm.getRawValue();
//         var canDownload = ((model.StartDate != null || model.StartDateRelativeTypeId != null) && (model.EndDate != null || model.EndDateRelativeTypeId != null));
//         return canDownload;

//     }

//     protected hasChanges() {
//         return !this.form.pristine;
//     }

//     ngOnInit(): void {
//         if (this.showControlInMoreAction) {
//             this.selectedContactRow(null);
//             this.PreviewForm = this.formBuilder.group(this.previewModel);
//             this.pdrForm = this.formBuilder.group(this.dataSourceModel);
//             this.buildPreviewForm();
//         }
//         this.form = this.formBuilder.group(this.model);





//         this.controlList.pdfColumns.data.options = [];
//         this.controlList.pdfColumns.data.optionsValue = "ColumnName";
//         this.controlList.pdfColumns.data.optionsText = "DisplayText"
//         this.controlList.pdfColumns.isAllListOptionSelected = true;
//         this.controlList.dataSourceSearchControl.data.service = this.clientSearchAPIService;
//         let queryListName = this.activatedRoute.snapshot.data['queryListName'];
//         this.title = this.activatedRoute.snapshot.data['title'];
//         let actionProviderType = this.activatedRoute.snapshot.data['actionProvider'];
//         this.queryDataProviderBHCode = this.activatedRoute.snapshot.data['dataProviderBHCode'];
//         // filter the Query data it pass from route
//         if (this.activatedRoute.snapshot.data['queryModifierCode'] !== undefined && this.activatedRoute.snapshot.data['queryModifierCode'] !== null) {
//             this.queryModifierCode = this.activatedRoute.snapshot.data['queryModifierCode'];
//         }
//         if (this.queryActions && this.queryActions.length === 0) {
//             if (actionProviderType == null) {
//                 this.actionProvider = new NullActionListProvider();
//             }
//             else {
//                 this.actionProvider = new actionProviderType(this.authRouter, this.dictionaryService);
//                 this.queryActions = this.actionProvider.queryActions;
//             }
//         }

//         switch (this.title) {
//             case "Tracking Items":
//                 this.hasUpdateAll = true;
//                 this.theDeleteCallback = this.deleteAll.bind(this);
//                 break;
//         }

//         this.queryOptionsLoading = true;

//         this.addSubscription =
//             Observable.forkJoin(
//                 this.queryService.getQueryList(queryListName),
//                 this.queryService.useLocalStorage(),
//                 this.queryService.getUserAccessLevel()
//             ).subscribe(
//                 data => {
//                     this.queryOptions = data[0];
//                     if (data[2] && data[2].length > 0) {
//                         data[2][0].AccessLevel == 'CREATE' ? this.isCreateAccess = true : this.isCreateAccess = false;

//                     }
//                     else {
//                         this.isCreateAccess = false;
//                     }
//                     if (this.currentUser.IsBHCAdmin == false || this.currentUser.IsSysAdmin == false) {
//                         this.queryOptions = this.getQueryListByUserId();
//                     }
//                     this.queryOptions.unshift(
//                         {
//                             id: '',
//                             displayText: "< Select a Query >"
//                         }
//                     );

//                     this.storage = data[1] ? localStorage : sessionStorage;
//                     this.getSessionState(queryListName);
//                     this.queryOptionsLoading = false;
//                     this.isLoading = false;
//                     this.queryHasRun = true;
//                     // run the last used query in this session

//                     if (this.selectedQueryId) {
//                         this.onChange(true);
//                     }
//                     else {
//                         if (this.currentUser.IsBHCAdmin == false || this.currentUser.IsSysAdmin == false) {
//                             if (this.isCreateAccess == false) {
//                                 this.isAllowAddQuery = true;
//                                 this.isAllowModifyQuery = true;
//                             }
//                             else {
//                                 this.isAllowAddQuery = false;
//                                 this.isAllowModifyQuery = true;
//                             }
//                             this.securityCheck();
//                         }
//                         else {
//                             this.isAllowAddQuery = false;
//                             this.isAllowModifyQuery = true;
//                         }
//                     }
//                 },
//                 error => this.queryOptionsLoading = false);
//     }

//     SetPreviewModal() {
//         if (this.currentTemplate.ContextType != undefined) {
//             this.showPreviewModal = false;
//             this.previewControlList.CategoryControl.label = "Select a " + this.currentTemplate.ContextType.Label;
//             if (this.currentTemplate.ContextType.BHCode == 'CLIENT') {
//                 this.previewControlList.CategoryControl.data.service = this.clientSearchAPIService;
//                 this.previewControlList.CategoryControl.data.serviceModelTextProperty = 'FullName';
//                 this.templateOptions = [
//                     { Id: 1, Label: 'Sample Client' },
//                     { Id: 2, Label: 'Select a Client' }
//                 ];
//             }
//             else if (this.currentTemplate.ContextType.BHCode == 'PRODUCT') {
//                 this.previewControlList.CategoryControl.data.service = this.productSearchAPIService;
//                 this.previewControlList.CategoryControl.data.serviceModelTextProperty = 'ProductFamily/ProductFamilyClassification/Label';
//                 this.templateOptions = [
//                     { Id: 1, Label: 'Sample Product' },
//                     { Id: 2, Label: 'Select a Product' }
//                 ];
//             }
//             else if (this.currentTemplate.ContextType.BHCode == 'DEAL') {
//                 this.previewControlList.CategoryControl.data.service = this.dealSearchAPIService;
//                 this.previewControlList.CategoryControl.data.serviceModelTextProperty = 'DealNumber';
//                 this.templateOptions = [
//                     { Id: 1, Label: 'Sample Deal' },
//                     { Id: 2, Label: 'Select a Deal' }
//                 ];
//             }
//             else if (this.currentTemplate.ContextType.BHCode == 'OPPORTUNITY') {
//                 this.previewControlList.CategoryControl.data.service = this.opportunitySearchAPIService;
//                 this.previewControlList.CategoryControl.data.serviceModelTextProperty = 'OpportunityTypeLable';
//                 this.templateOptions = [
//                     { Id: 1, Label: 'Sample Opportunity' },
//                     { Id: 2, Label: 'Select a Opportunity' }
//                 ];
//             }
//             else if (this.currentTemplate.ContextType.BHCode == 'TRACKINGITEM') {
//                 this.previewControlList.CategoryControl.data.service = this.trackingItemSearchAPIService;
//                 this.previewControlList.CategoryControl.data.serviceModelTextProperty = 'TrackingItem/Key';
//                 this.templateOptions = [
//                     { Id: 1, Label: 'Sample Tracking Item' },
//                     { Id: 2, Label: 'Select a Tracking Item' }
//                 ];
//             }
//             this.previewControlList.TemplateOptionControl.data.options = this.templateOptions;
//             this.queryService.getDocumentOutputTypes(this.currentTemplate.Id)
//                 .subscribe(result => {
//                     this.removeDuplicatesDefaultOutputType(result)
//                     this.previewControlList.DefaultOutputTypeControl.data.options = this.defaultOutTypeOptions;
//                     this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].setValue(this.currentTemplate.DocumentOutputType.Id);
//                     this.showPreviewModal = true;

//                 });
//         }
//         this.showPreviewModal = true;
//     }

//     private removeDuplicatesDefaultOutputType(options: any[] = []) {
//         for (let i = 0; i < options.length; i++) {
//             let id = options[i].Id;
//             let records = options.filter(x => x.Id == id);
//             if (records != undefined && records.length != 1) {
//                 options.splice(i, 1);
//             }
//         }
//         this.defaultOutTypeOptions = options;
//     }


//     private buildPreviewForm() {
//         this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].valueChanges
//             .subscribe(data => this.onChangeTemplateOption());
//         this.PreviewForm.controls[this.previewControlList.CategoryControl.key].valueChanges
//             .subscribe(data => this.onChangeCategory());
//         this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].valueChanges
//             .subscribe(data => this.onChangeOutputType());
//     }


//     onDateOptionChange() {
//         let model = this.pdrForm.getRawValue();
//         if (model.IsStartDateCalender == 'date') {
//             this.controlList.startDate.data.DropdownControl.data.options = [];
//             if (model.StartDate == null) {
//                 this.pdrForm.controls[this.controlList.startDate.data.DateControl.key].setValue(this.dataSourceModel.StartDate);
//             }
//             this.pdrForm.controls[this.controlList.startDate.data.DropdownControl.key].setValue(null);
//         }
//         if (model.IsStartDateCalender == 'options') {
//             this.pdrForm.controls[this.controlList.startDate.data.DateControl.key].setValue(null);
//             this.controlList.startDate.data.DropdownControl.data.options = this.dateOptions.filter(x => x.Code !== "EndProductLife");
//         }
//         if (model.IsEndDateCalender == 'date') {

//             this.controlList.endDate.data.DropdownControl.data.options = [];
//             if (model.EndDate == null) {
//                 this.pdrForm.controls[this.controlList.endDate.data.DateControl.key].setValue(this.dataSourceModel.EndDate);
//             }
//             this.pdrForm.controls[this.controlList.endDate.data.DropdownControl.key].setValue(null);
//         }
//         if (model.IsEndDateCalender == 'options') {
//             this.pdrForm.controls[this.controlList.endDate.data.DateControl.key].setValue(null);
//             this.controlList.endDate.data.DropdownControl.data.options = this.dateOptions.filter(x => x.Code !== "StartProductLife");
//         }
//     }

//     onCloseContact() {
//         let internalSort: any = {
//             columnName: null,
//             isDescending: false,
//             columnReference: null
//         };

//         if (this.contactListGrid != null && this.contactListGrid != undefined) {
//             this.contactListGrid.internalSort = internalSort;
//             this.contactListGrid.pageLength = 10;
//             this.contactListGrid.onRefresh();

//         }
//         if (this.addressListGrid != null && this.addressListGrid != undefined) {
//             this.addressListGrid.pageLength = 10;
//             this.addressListGrid.internalSort = internalSort;
//             this.addressListGrid.onRefresh();
//         }
//     }

//     private getSessionState(queryListName: string) {
//         this.storageKey = `QueryListState_${queryListName}`;
//         let state = this.storage.getItem(this.storageKey);
//         if (state) {
//             let obj = JSON.parse(state);
//             for (var propName in obj)
//                 this.state[propName] = obj[propName];
//             if (this.queryOptions.find(o => o.id == this.state.queryId)) {
//                 this.selectedQueryId = this.state.queryId;
//             }
//         }
//     }

//     @HostListener('window:unload')
//     private saveSessionState() {
//         // Changing features too quickly prevents storage from being loaded and this fails with undefined.
//         if (this.storage == null) {
//             return;
//         }
//         this.state.bodyScrollTop = document.body.scrollTop;
//         this.storage.setItem(this.storageKey, JSON.stringify(this.state));
//     }

//     selectedRecentRow(selectedRow) {
//         this.selectedQueryRow({
//             Id: selectedRow.ForeignId
//         });
//     }
//     /* 
//      * pass the navToRoute in from the route as <AuthRoute>{primary: 'ROUTENAME/ROWID', section: 'ROUTENAME/ROWID' }
//      * it should be named navToRoute
//      */
//     selectedQueryRow(selectedRow) {
//         let navToAuthRoute: AuthRoute = this.activatedRoute.snapshot.data['navToAuthRoute'];
//         if (navToAuthRoute != null) {
//             let clone: AuthRoute = new AuthRoute();
//             if (navToAuthRoute.primary) {
//                 clone.primary = navToAuthRoute.primary.replace('ROWID', selectedRow.Id);
//             }
//             if (navToAuthRoute.section) {
//                 clone.section = navToAuthRoute.section.replace('ROWID', selectedRow.Id);
//             }
//             this.authRouter.navigate(clone);
//         }
//     }

//     onChange(restoreState = false) {
//         if (!this.selectedQueryId) {
//             this.queryChange.emit(this.selectedQueryId);
//             if (this.currentUser.IsBHCAdmin == false || this.currentUser.IsSysAdmin == false) {
//                 if (this.isCreateAccess == false) {
//                     this.isAllowAddQuery = true;
//                     this.isAllowModifyQuery = true;
//                 }
//                 else {
//                     this.isAllowAddQuery = false;
//                     this.isAllowModifyQuery = true;
//                 }
//             }
//             else {
//                 this.isAllowAddQuery = false;
//                 this.isAllowModifyQuery = true;
//             }
//             return;
//         }
//         this.queryListLoading = true;
//         this.queryHasRun = false;
//         this.queryService.getQueryResults(this.selectedQueryId, this.queryModifierCode)
//             .subscribe(
//             data => {
//                 if (data.rows) {
//                     this.parseHighlightedRows(data.rows);
//                 }
//                 this.pagingService._columns = [];  // columns change when query changes
//                 this.pagingService.data = data.rows;
//                 this.rows = data.rows;
//                 this.pagingService._columns = data.columns.filter(x => !x.IsDetailLine || !x.IsGroupColumn);
//                 this.columns = data.columns.filter(x => x.IsDetailLine != true || x.IsGroupColumn != true);
//                 let column = this.columns.find(c => !c.IsGroupColumn && !c.IsKeyColumn);
//                 this.defaultSortColumn = (column != null) ? column.ColumnName : null;
//                 this.state.queryId = this.selectedQueryId;
//                 if (!restoreState) {
//                     let column = data.columns.find(c => !c.IsGroupColumn && !c.IsKeyColumn);
//                     this.state.sortColumnName = column ? column.ColumnName : null;
//                     this.state.sortDescending = false;
//                     this.state.pageNumber = 1;
//                     this.state.pageLength = 10;
//                     this.state.filters = [];
//                     this.state.bodyScrollTop = 0;
//                 }
//                 this.queryHasRun = true;
//                 this.queryListLoading = false;
//                 this.isLoading = false;
//                 this.saveSessionState();
//             }
//             );
//         if (this.currentUser.IsBHCAdmin == false || this.currentUser.IsSysAdmin == false) {
//             if (this.isCreateAccess == false) {
//                 this.isAllowAddQuery = true;
//                 this.isAllowModifyQuery = true;
//             }
//             else {
//                 this.isAllowAddQuery = false;
//             }
//             if (this.modifyAccessRows.find(x => x.id == this.selectedQueryId) == null || this.modifyAccessRows.find(x => x.id == this.selectedQueryId) == undefined) {
//                 this.isAllowModifyQuery = true;
//             }
//             else {
//                 this.isAllowModifyQuery = false;
//             }
//         }
//         else {
//             this.isAllowModifyQuery = false;
//             this.isAllowAddQuery = false;
//         }
//         this.queryChange.emit(this.selectedQueryId);
//         this.securityCheck();
//     }

//     parseHighlightedRows(rows) {
//         for (let i = 0; i < rows.length; i++) {
//             let row = rows[i];
//             if (row && row.IsCritical === 'Yes') {
//                 if (!row.rowClasses)
//                     row.rowClasses = [];
//                 row.rowClasses.push('attention-row');
//             }
//         }
//     }

//     setDataSourceProperty(rowObject: any) {
//         this.showModal = false;
//         if (rowObject != undefined && rowObject.ContextType != null && rowObject.DocumentDataSource != null && rowObject.ContextCategory != null) {
//             this.contextCategoryBHCode = rowObject.ContextCategory.BHCode;
//             this.contextTypeBHCode = rowObject.ContextType.BHCode;
//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'CLIENT' && rowObject.DocumentDataSource.Label == 'Single Client Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE")) {
//                 this.controlList.dataSourceSearchControl.data.service = this.clientSearchAPIService;
//                 this.isDataSourceDisabled = false;
//                 this.isPreviewDisabled = false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'PRODUCT' && rowObject.DocumentDataSource.Label == 'Single Product Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE" || rowObject.ContextCategory.BHCode == "PDR")) {

//                 this.controlList.dataSourceSearchControl.data.service = this.productSearchAPIService;
//                 this.isDataSourceDisabled = false;

//                 this.isPreviewDisabled = (rowObject.ContextCategory.BHCode == "PDR") ? true : false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'DEAL' && rowObject.DocumentDataSource.Label == 'Single Deal Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "CREDITMEMO" || rowObject.ContextCategory.BHCode == "DOCPREP")) {

//                 this.controlList.dataSourceSearchControl.data.service = this.dealSearchAPIService;
//                 this.isDataSourceDisabled = false;
//                 this.isPreviewDisabled = false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'DEAL' && rowObject.DocumentDataSource.Label == 'Single Deal Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE" || rowObject.ContextCategory.BHCode == "CREDITMEMO")) {

//                 this.isPreviewDisabled = false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'OPPORTUNITY' && rowObject.DocumentDataSource.Label == 'Single Opportunity Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE" || rowObject.ContextCategory.BHCode == "PDR")) {

//                 this.controlList.dataSourceSearchControl.data.service = this.opportunitySearchAPIService;
//                 this.isDataSourceDisabled = false;
//                 this.isPreviewDisabled = (rowObject.ContextCategory.BHCode == "PDR") ? true : false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'TRACKINGITEM' && rowObject.DocumentDataSource.Label == 'Single Tracking Item Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE")) {

//                 this.controlList.dataSourceSearchControl.data.service = this.trackingItemSearchAPIService;
//                 this.isDataSourceDisabled = false;
//                 this.isPreviewDisabled = false;
//             }
//             this.showModal = true;

//             this.dataSource.bhControl = this.controlList.dataSourceSearchControl;

//         }

//     }

//     setSampleDataSourceProperty(rowObject: any) {
//         if (rowObject != undefined && rowObject.ContextType != null && rowObject.DocumentDataSource != null && rowObject.ContextCategory != null) {
//             this.contextCategoryBHCode = rowObject.ContextCategory.BHCode;
//             this.contextTypeBHCode = rowObject.ContextType.BHCode;
//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'CLIENT' && rowObject.DocumentDataSource.Label == 'Single Client Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "CREDITMEMO" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE")) {
//                 this.isSampleDataSourceDisabled = false;
//             }
//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'PRODUCT' && rowObject.DocumentDataSource.Label == 'Single Product Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "CREDITMEMO" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE")) {
//                 this.isSampleDataSourceDisabled = false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'DEAL' && rowObject.DocumentDataSource.Label == 'Single Deal Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "CREDITMEMO" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE")) {
//                 this.isSampleDataSourceDisabled = false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'OPPORTUNITY' && rowObject.DocumentDataSource.Label == 'Single Opportunity Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "CREDITMEMO" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE")) {
//                 this.isSampleDataSourceDisabled = false;
//             }

//             if (rowObject != undefined && rowObject.ContextType.BHCode == 'TRACKINGITEM' && rowObject.DocumentDataSource.Label == 'Single Tracking Item Provider' && (rowObject.ContextCategory.BHCode == "OTHER" || rowObject.ContextCategory.BHCode == "CREDITMEMO" || rowObject.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE")) {
//                 this.isSampleDataSourceDisabled = false;
//             }
//         }
//     }


//     onCheckedRow(row) {
//         this.hasCheckedRows = true;
//         if (this.actionProvider) {
//             this.actionProvider.enableDisableAll(true);
//         }
//         this.checkRow.emit(row);
//     }

//     getOptionsForDate() {
//         this.addSubscription = Observable.forkJoin(this.queryService.getRelativeDateBaseTypeForPDR())
//             .subscribe(result => {
//                 this.dateOptions = result[0];
//                 this.controlList.startDate.data.DropdownControl.data.options = result[0].filter(x => x.Code !== "EndProductLife");
//                 this.controlList.endDate.data.DropdownControl.data.options = result[0].filter(x => x.Code !== "StartProductLife");

//             },
//             error => {
//             });
//     }
//     downloadDataSource() {
//         document.body.style.cursor = this.state.cursorWait;
//         this.dataSourceModel.Operation = "Data";
//         this.queryService.getDataSource(this.dataSourceModel)
//             .subscribe(result => {
//                 this.downloadToken = result;
//                 let api = this.unificationAPIService.getFileDownloadURL(this.downloadToken, true);
//                 window.open(api);
//                 setTimeout(() => document.body.style.cursor = this.state.cursorDefault, 7);
//             },
//             error => {
//                 setTimeout(() => document.body.style.cursor = this.state.cursorDefault, 7);
//             });

//     }
//     selectedAddressRow(selectedRow) {
//         this.isAllowDownload = false;
//         this.contactAddressId = selectedRow.Id;

//     }
//     selectedContactRow(selectedRow) {
//         let internalSort: any = {
//             columnName: null,
//             isDescending: false,
//             columnReference: null
//         };
//         this.isAllowDownload = true;
//         this.contactAddressService = new ContactAddressAPIService(this.baseService);
//         this.contactId = (selectedRow !== null) ? selectedRow.Id : '00000000-0000-0000-0000-000000000000';
//         let Id = (selectedRow !== null) ? selectedRow.ContactClientId : '00000000-0000-0000-0000-000000000000';
//         this.contactAddressService.setDefaultFilter(this.contactId);

//         if (this.addressListGrid != null && this.addressListGrid.getData) {
//             this.addressListGrid.internalSort = internalSort;
//             this.addressListGrid.service = this.contactAddressService;
//             this.addressListGrid.getData(true);
//         }
//     }

//     public getMonth() {
//         this.isFormReady = false;
//         this.disableDefault = false;
//         setTimeout(() => this.isFormReady = true, 0);
//         this.profitabilityCalculationApiService.getSystemProperties()
//             .subscribe(result => {
//                 let property = result.value.filter(x => x.Name === 'ProfitabilityReportRange');
//                 this.month = (property != null && property.length > 0) ? property[0] : null;
//                 this.getProductOrOpportunityDetail(this.paramId, this.month);

//             },

//             error => {
//             });
//     }


//     public getProductOrOpportunityDetail(id: string, month: any) {
//         let numberOfMonths = Number(month.Value) - 1;
//         if (this.contextTypeBHCode === 'OPPORTUNITY') {
//             this.dataSourceModel.EndDate = null;
//             this.dataSourceModel.StartDate = null;

//             this.opportunityDetailsApiService.getOpportunityById(id)
//                 .subscribe(result => {
//                     if (result.DateEstimatedClose != null && result.DateEstimatedClose != undefined && result.DateEstimatedClose != "") {
//                         this.dataSourceModel.EndDate = moment.utc(result.DateEstimatedClose).add(numberOfMonths, 'M');
//                         this.dataSourceModel.StartDate = moment.utc(result.DateEstimatedClose);
//                         if (result.MaturityTimeTypeId != null && result.MaturityTime != null) {
//                             let endDateFromMaturityDate = null;
//                             if (result.MaturityTimeType.Code == "MONTHS") {
//                                 endDateFromMaturityDate = moment.utc(result.DateEstimatedClose).add(result.MaturityTime, 'M');
//                             }
//                             else if (result.MaturityTimeType.Code == "YEARS") {
//                                 endDateFromMaturityDate = moment.utc(result.DateEstimatedClose).add(result.MaturityTime, 'Y');
//                             }
//                             if (this.dataSourceModel.EndDate > endDateFromMaturityDate) {
//                                 this.dataSourceModel.EndDate = endDateFromMaturityDate;
//                             }

//                         }

//                     }

//                     this.pdrForm.controls[this.controlList.startDate.data.DateControl.key].setValue(this.dataSourceModel.StartDate);
//                     this.pdrForm.controls[this.controlList.endDate.data.DateControl.key].setValue(this.dataSourceModel.EndDate);
//                     let interval = this.interval.find(x => x.Id == "Months");
//                     this.dataSourceModel.Interval = interval.Id;
//                     this.pdrForm.controls[this.controlList.reportInterval.key].setValue(this.dataSourceModel.Interval);
//                 },
//                 error => {
//                 });
//         }
//         if (this.contextTypeBHCode === 'PRODUCT') {
//             let endDateFromMaturityDate = null;
//             this.clientProductsAPIService.getProduct(id)
//                 .subscribe(result => {
//                     if (result.CurrentBalanceDate != null && result.CurrentBalanceDate != undefined && result.CurrentBalanceDate != "") {
//                         this.dataSourceModel.EndDate = moment.utc(result.CurrentBalanceDate).add(numberOfMonths, 'M');
//                         this.dataSourceModel.StartDate = moment.utc(result.CurrentBalanceDate);
//                         if (result.CurrentMaturityDate != null && result.CurrentMaturityDate != undefined) {
//                             endDateFromMaturityDate = moment.utc(result.CurrentMaturityDate);
//                             if (this.dataSourceModel.EndDate > endDateFromMaturityDate) {
//                                 this.dataSourceModel.EndDate = endDateFromMaturityDate;
//                             }
//                         }
//                     }
//                     this.pdrForm.controls[this.controlList.startDate.key].setValue(this.dataSourceModel.StartDate);
//                     this.pdrForm.controls[this.controlList.endDate.key].setValue(this.dataSourceModel.EndDate);
//                     let interval = this.interval.find(x => x.Id == "Months");
//                     this.dataSourceModel.Interval = interval.Id;
//                     this.pdrForm.controls[this.controlList.reportInterval.key].setValue(this.dataSourceModel.Interval);
//                 },
//                 error => {
//                 });
//         }
//     }

//     onModalClose() {
//         this.dealList.hide('true');
//     }


//     onDataSourceSearchModalClose(selectedRow) {
//         this.paramId = selectedRow.Id;
//         if (this.contextTypeBHCode !== 'DEAL') {
//             if ((this.contextTypeBHCode === 'PRODUCT' || this.contextTypeBHCode === 'OPPORTUNITY') && this.contextCategoryBHCode == 'PDR') {
//                 this.getOptionsForDate()
//                 this.getMonth();
//                 this.pdrModel.show();

//             }

//             if (this.contextCategoryBHCode == 'INDIVIDUALCORRESPONDENCE') {
//                 this.clientId = (this.contextTypeBHCode == 'CLIENT') ? selectedRow.Id : selectedRow.ClientId;
//                 this.isAllowDownload = true;
//                 if (this.contactListGrid != null && this.contactListGrid.getData) {
//                     this.clientContactAPIService.setDefaultFilter(this.clientId);
//                     this.contactListGrid.getData(true);
//                     this.selectedContactRow(null);
//                 }
//                 this.contactList.show();
//             }
//         }
//         if (this.contextTypeBHCode == 'DEAL') {
//             if (this.contextCategoryBHCode == 'DOCPREP') {
//                 this.opportunityId = selectedRow.Id;
//                 this.dealId = selectedRow.Id;
//                 this.paramId = this.dealId;
//                 this.isAllowDownload = true;
//                 this.dealList.show();
//                 this.documentPreparationTabs.templateId = this.selectedRowIds[0];
//                 this.documentPreparationTabs.dealId = this.paramId;
//                 this.documentPreparationTabs.isComponentShownInModel = true;
//                 this.documentPreparationTabs.isReady = true;
//                 this.documentPreparationTabs.getData(this.selectedRowIds[0], this.paramId);
//             }
//             else {
//                 document.body.style.cursor = this.state.cursorWait;
//                 this.setDataSourceModel();
//                 this.downloadDataSource();
//             }
//         }
//         if (this.contextCategoryBHCode == "OTHER") {
//             document.body.style.cursor = this.state.cursorWait;
//             this.setDataSourceModel();
//             this.downloadDataSource();
//         }


//     }

//     getPreview() {
//         this.selectedEntityIds = [];
//         this.SetPreviewModal(); 
//         if (this.contextCategoryBHCode == 'DOCPREP') {
//             this.showDocPrepModal = false;
//             setTimeout(() => this.showDocPrepModal = true, 2); 
//             //this.showDocPrep = false;
//             //setTimeout(() => this.showDocPrep = true, 2);
//             this.isPreviewForDocPrep = true;
//             this.samplePreview = true;
//             setTimeout(() => this.samplePreview = false, 2);
//         }
//         else {
//             this.samplePreview = true;
//             this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].setValue(1);
//         }
//         this.PreviewForm.controls[this.previewControlList.CategoryControl.key].setValue(null);
//         this.isPreview = true;
//         this.previewModalValid = true;
//         this.previewModal.show();
//     }

//     closePreview() {
//         this.previewModal.hide('true');
//         this.isPreviewForDocPrep = false;
//     }


//     onChangeTemplateOption() {
//         this.previewModalValid = false;
//         if (this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value != null && this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value != "") {
//             if (this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value == 1) {
//                 this.samplePreview = true;
//                 this.PreviewForm.controls[this.previewControlList.CategoryControl.key].setValue(null);
//                 this.PreviewForm.controls[this.previewControlList.CategoryControl.key].setValidators(null);
//                 if (this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != null && this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != "") {
//                     this.previewModalValid = true;
//                 } else {
//                     this.previewModalValid = false;
//                 }
//             } else if (this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value == 2) {
//                 this.samplePreview = false;
//                 this.PreviewForm.controls[this.previewControlList.CategoryControl.key].setValidators([Validators.required]);
//                 if (this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != null && this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != "" && this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != null && this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != "") {
//                     this.previewModalValid = true;
//                 } else {
//                     this.previewModalValid = false;
//                 }
//             }
//             this.PreviewForm.controls[this.previewControlList.CategoryControl.key].updateValueAndValidity();
//         }
//     }
//     onChangeCategory() {
//         if (this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != null && this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != "") {
//             if (!this.isPreviewForDocPrep) {
//                 if (this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value != null && this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value != "" && this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != null && this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != "") {
//                     this.previewModalValid = true;
//                 } else {
//                     this.previewModalValid = false;
//                 }
//             }
//             else {
//                 this.previewModalValid = true;
//             }
//         }
//     }
//     onChangeOutputType() {
//         if (this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != null && this.PreviewForm.controls[this.previewControlList.DefaultOutputTypeControl.key].value != "") {
//             if (!this.isPreviewForDocPrep) {
//                 if (this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value === 1) {
//                     this.previewModalValid = true;
//                 }
//                 else {
//                     if (this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value != null && this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value != "" && this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != null && this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != "") {
//                         this.previewModalValid = true;
//                     } else {
//                         this.previewModalValid = false;
//                     }
//                 }
//             }
//             else if (this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != null && this.PreviewForm.controls[this.previewControlList.CategoryControl.key].value != "") {
//                 this.previewModalValid = true;
//             }
//             else {
//                 this.previewModalValid = false;
//             }
//         }
//     }
//     setSelectedRowByPreview(selectedRow) {
//         this.selectedRowByPreview = selectedRow;
//     }
//     previewDocument() {
//         let model = this.PreviewForm.getRawValue() as TemplatePreviewModel;
//         model.Operation = this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value === 1 ? "Sample" : "Data";

//         if (this.currentTemplate.ContextCategory.BHCode == "OTHER" || this.currentTemplate.ContextCategory.BHCode == "CREDITMEMO") {
//             model.TemplateId = this.currentTemplate.Id;
//             this.previewModel = model;
//             this.downloadPreview(model);
//             this.closePreview();
//         }
//         else if (this.currentTemplate.ContextCategory.BHCode == "INDIVIDUALCORRESPONDENCE" || this.currentTemplate.ContextCategory.BHCode == "DOCPREP") {
//             this.documentPreparationTabs.documentOutputTypeId = model.DocumentOutputTypeId;
//             this.dataSourceModalTitle = "Preview Options";
//             this.dataSourcebuttonText = "Preview";
//             model.TemplateId = this.currentTemplate.Id;
//             this.previewModel = model;
//             this.closePreview();
//             if (this.currentTemplate.ContextCategory.BHCode == "DOCPREP") {
//                 this.onDataSourceSearchModalClose(this.selectedRowByPreview);
//             }
//             else if (this.PreviewForm.controls[this.previewControlList.TemplateOptionControl.key].value === 2) {
//                 this.onDataSourceSearchModalClose(this.selectedRowByPreview);
//             }
//             else {
//                 this.downloadPreview(model);
//             }
//         }
//     }

//     downloadPreview(model: any) {
//         document.body.style.cursor = this.state.cursorWait;
//         this.addSubscription = this.queryService.getDocument(model)
//             .subscribe(token => {

//                 window.open(this.queryService.getDocumentDownloadUrl(token));
//                 setTimeout(() => document.body.style.cursor = this.state.cursorDefault, 7);
//             },
//             error => {
//                 setTimeout(() => document.body.style.cursor = this.state.cursorDefault, 7);
//             });
//     }
//     get disableDownloadButtonForDocPrep() {
//         return !(this.selectedEntityIds.length > 0);
//     }
//     onEntityFilterGridList(event: any) {
//         this.entityFilterGridList = event;
//     }

//     downloadDocPrepDocument(event) {
//         if (this.documentPreparationTabs != undefined) {
//             this.documentPreparationTabs.onDownloadDocument(this.entityFilterGridList);
//         }
//     }

//     onSelectedEntityIdsChange(selectedEntityIds: any) {       
//         this.selectedEntityIds=selectedEntityIds;
//     }

//     downloadPreviewDocument() {
//         document.body.style.cursor = this.state.cursorWait;
//         this.previewModel.ContactId = this.contactId;
//         this.previewModel.AddressId = this.contactAddressId;

//         this.downloadPreview(this.previewModel);
//     }

//     downloadXML() {
//         document.body.style.cursor = this.state.cursorWait;
//         this.setDataSourceModel();
//         this.downloadDataSource();
//         this.onCloseContact();
//     }

//     setDataSourceModel() {
//         this.dataSourceModel.TemplateId = this.selectedRowIds[0];
//         this.dataSourceModel.ParamId = this.paramId;
//         this.dataSourceModel.ContactId = this.contactId;
//         this.dataSourceModel.ContactAddressId = this.contactAddressId;
//         if (this.contextCategoryBHCode == 'PDR') {
//             let model = this.pdrForm.getRawValue();
//             this.dataSourceModel.StartDateRelativeTypeId = model.StartDateRelativeTypeId;
//             this.dataSourceModel.EndDateRelativeTypeId = model.EndDateRelativeTypeId;
//             var startDateRelativeTypeCode = this.dateOptions.find(x => x.Id == model.StartDateRelativeTypeId);
//             var endDateRelativeTypeCode = this.dateOptions.find(x => x.Id == model.EndDateRelativeTypeId);
//             if (startDateRelativeTypeCode != undefined)
//                 this.dataSourceModel.StartDateRelativeTypeCode = startDateRelativeTypeCode.Code;
//             if (endDateRelativeTypeCode != undefined)
//                 this.dataSourceModel.EndDateRelativeTypeCode = endDateRelativeTypeCode.Code;
//             if (model.StartDate != undefined && model.StartDate != null)
//                 this.dataSourceModel.StartDate = AppFunctions.parseDate(model.StartDate).format('MM/DD/YYYY');
//             this.dataSourceModel.Interval = model.Interval;
//             if (model.EndDate != undefined && model.EndDate != null)
//                 this.dataSourceModel.EndDate = AppFunctions.parseDate(model.EndDate).format('MM/DD/YYYY');

//         }

//     }

//     onSelectedRowsIdsChange(selectedRowIds: string[]) {
//         this.isDataSourceDisabled = true;
//         this.isSampleDataSourceDisabled = true;
//         this.isPreviewDisabled = true;
//         this.selectedRowIds = selectedRowIds;
//         if (this.showControlInMoreAction && selectedRowIds.length == 1) {
//             this.queryService.getTemplate(
//                 this.selectedRowIds[0],
//             ).subscribe(result => {
//                 this.setSampleDataSourceProperty(result);
//                 this.currentTemplate = result;
//                 this.setDataSourceProperty(result);
//             },
//                 error => {
//                 });
//         }
//         this.selectedRowIdsChange.emit(selectedRowIds);
//     }

//     onFilteredRowsIdsChange(filteredRowIds: string[]) {
//         this.filteredRowIds = filteredRowIds;
//     }

//     onClearChecked() {
//         this.hasCheckedRows = false;
//         if (this.actionProvider) {
//             this.actionProvider.enableDisableAll(false);
//         }
//         this.selectedRowIdsChange.emit([]);
//     }

//     onRefresh() {
//         this.onChange();
//     }

//     /*
//      * pass the navToRoute in from the route as '<AuthRoute>{ primary: querydetails/IDTOKEN }'
//      * it should be named editQueryRoute
//      */
//     onEditQuery() {
//         if (this.selectedQueryId) {

//             let editQueryRoute: AuthRoute = this.activatedRoute.snapshot.data['editQueryRoute'];
//             if (editQueryRoute != null) {
//                 let clone: AuthRoute = new AuthRoute();
//                 if (editQueryRoute.primary) {
//                     clone.primary = editQueryRoute.primary.replace('IDTOKEN', this.selectedQueryId);
//                 }
//                 if (editQueryRoute.section) {
//                     clone.section = editQueryRoute.section.replace('IDTOKEN', this.selectedQueryId);
//                 }

//                 this.authRouter.navigate(clone);
//             }
//         }
//     }

//     onAddQuery() {
//         let newQueryRoute: AuthRoute = this.activatedRoute.snapshot.data['newQueryRoute'];
//         if (newQueryRoute != null) {
//             let clone: AuthRoute = new AuthRoute();
//             if (newQueryRoute.primary) {
//                 clone.primary = newQueryRoute.primary;
//             }

//             this.authRouter.navigate(clone);
//         }
//     }

//     private onPageNumberChange(pageNumber: number) {
//         this.pagingChange.emit();
//         if (!this.queryListLoading) {
//             this.state.pageNumber = pageNumber;
//             this.saveSessionState();
//         }
//     }

//     private onPageLengthChange(pageLength: 10 | 20 | 40) {
//         if (!this.queryListLoading) {
//             this.state.pageLength = pageLength;
//             this.saveSessionState();
//         }
//     }

//     private onSortChange(sort: any) {
//         if (!this.queryListLoading) {
//             this.state.sortColumnName = sort.columnName;
//             this.state.sortDescending = sort.isDescending;
//             this.saveSessionState();
//         }
//     }

//     private onFilterChange(filters: IColumnSearch[]) {
//         if (!this.queryListLoading) {
//             this.state.filters = filters;
//             this.saveSessionState();
//         }
//     }

//     private onRowsPopulated() {
//         if (this.queryListLoading) {
//             let top = this.state.bodyScrollTop;
//             setTimeout(() => document.body.scrollTop = top);
//         }
//     }

//     exportToExcel() {
//         let apiUrl = AppSettings.API_BASE_URL + 'api/query/';

//         this.queryService.getExcelDownloadToken(
//             this.selectedQueryId,
//             this.filteredRowIds,
//             this.getSortColumn())
//             .subscribe(result => {
//                 this.downloadToken = result;
//                 let api = this.unificationAPIService.getFileDownloadURL(this.downloadToken);
//                 window.open(api);
//             },
//             error => {
//             });
//     }

//     chooseColumns(modal) {
//         this.controlList.pdfColumns.data.options = [];

//         this.columns.forEach(column => {
//             if (column.DisplayText != null) {
//                 this.controlList.pdfColumns.data.options.push(column);
//             }
//         });
//         modal.show();
//     }

//     getSortColumn() {
//         let sortColumn = '';
//         let groupColumns = [];
//         this.pagingService.columns.forEach(column => {
//             if (column.IsGroupColumn) {
//                 groupColumns.push(column.ColumnName.split('_')[1] + " ASC");
//             }
//             else
//                 if (column.isDescending != null) {
//                     if (column.isDescending == true) {
//                         sortColumn = column.ColumnName + " DESC";
//                     }
//                     else {
//                         sortColumn = column.ColumnName + " ASC";
//                     }
//                 }
//         });
//         if (sortColumn != '') {
//             groupColumns.push(sortColumn);
//         }
//         return groupColumns.toString();
//     }

//     exportToPDF(checkboxes) {
//         let apiUrl = AppSettings.API_BASE_URL + 'api/query/';
//         this.queryService.getPDFDownloadToken(
//             this.selectedQueryId,
//             this.filteredRowIds,
//             checkboxes.form.controls.ColumnName.value,
//             this.getSortColumn())
//             .subscribe(result => {
//                 this.downloadToken = result;
//                 let api = this.unificationAPIService.getFileDownloadURL(this.downloadToken);
//                 window.open(api);
//             },
//             error => {
//             });
//         this.controlList.pdfColumns.isAllListOptionSelected = true;
//     }

//     deleteAll(): any {
//         this.trackingItemsService.deleteMultipleTrackingItem(this.selectedRowIds)
//             .subscribe(result => {
//                 this.notificationService.success("The selected tracking items has been deleted.");
//                 this.onChange();
//             });
//     }

//     getDataSource() {
//         this.selectedEntityIds = [];
//         this.showDocPrepModal = false;
//         setTimeout(() => this.showDocPrepModal = true, 2);
//         this.isPreview = false;
//         this.dataSourceModalTitle = 'Download Options'
//         if (this.dataSource != null) {
//             this.dataSource.OnModalShow();
//         }
//     }

//     getSampleDataSource() {
//         document.body.style.cursor = this.state.cursorWait;
//         this.operation = "Sampledata";

//         this.queryService.getSampleDataSource(
//             this.selectedRowIds[0],
//             this.selectedRowIds,
//             this.operation)
//             .subscribe(result => {
//                 this.downloadToken = result;
//                 let api = this.unificationAPIService.getFileDownloadURL(this.downloadToken, true);
//                 window.open(api);
//                 setTimeout(() => document.body.style.cursor = this.state.cursorDefault, 7);
//             },
//             error => {
//                 setTimeout(() => document.body.style.cursor = this.state.cursorDefault, 7);
//             });
//     }

//     onDelete() {
//         this.notificationService.confirm(this.theDeleteCallback, "Are you sure you want to delete?");
//     }

//     onBusinessRule() {
//         this.businessRule.emit(null);
//     }

//     onDecisionRule() {
//         this.decisionRule.emit(null);
//     }

//     onCreateTemplate() {
//         this.createTemplate.emit(null);
//     }

//     getQueryListByUserId(): any[] {

//         let queryList: any[] = [];
//         queryList = this.queryOptions;

//         let noAccessRows: any[] = [];
//         let viewAccessRows: any[] = [];

//         queryList.forEach(x => {
//             let userAccess: string;
//             let everyoneAccess: string;
//             if (x.deniedReadAccess == false && x.deniedWriteAccess == false && x.deniedDeleteAccess == false) {
//                 userAccess = 'Modify Access';
//             }
//             else if (x.deniedReadAccess == false && x.deniedWriteAccess == false && x.deniedDeleteAccess == true) {
//                 userAccess = 'Modify Access';
//             }
//             else if (x.deniedReadAccess == false && x.deniedWriteAccess == true && x.deniedDeleteAccess == true) {
//                 userAccess = 'View Access';
//             }
//             else if (x.deniedReadAccess == true && x.deniedWriteAccess == true && x.deniedDeleteAccess == true) {
//                 userAccess = 'No Access';
//             }
//             if (x.everyoneRead == false && x.everyoneWrite == false) {
//                 everyoneAccess = 'No Access';
//             }
//             else if (x.everyoneRead == true && x.everyoneWrite == false) {
//                 everyoneAccess = 'View Access';
//             }
//             else if (x.everyoneRead == true && x.everyoneWrite == true) {
//                 everyoneAccess = 'Modify Access';
//             }
//             //Checking final accessible queries
//             if (everyoneAccess == 'No Access' && userAccess == 'No Access') {
//                 noAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'No Access' && userAccess == 'View Access') {
//                 viewAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'No Access' && userAccess == 'Modify Access') {
//                 this.modifyAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'View Access' && userAccess == 'No Access') {
//                 viewAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'View Access' && userAccess == 'View Access') {
//                 viewAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'View Access' && userAccess == 'Modify Access') {
//                 this.modifyAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'Modify Access' && userAccess == 'No Access') {
//                 this.modifyAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'Modify Access' && userAccess == 'View Access') {
//                 this.modifyAccessRows.push(x);
//             }
//             else if (everyoneAccess == 'Modify Access' && userAccess == 'Modify Access') {
//                 this.modifyAccessRows.push(x);
//             }
//         });
//         queryList = [];
//         if (viewAccessRows && viewAccessRows.length > 0) {
//             viewAccessRows.forEach(x => queryList.push(x))
//         }
//         if (this.modifyAccessRows && this.modifyAccessRows.length > 0) {
//             this.modifyAccessRows.forEach(x => queryList.push(x))
//         }
//         if (this.currentUser.IsBHCAdmin == false || this.currentUser.IsSysAdmin == false) {
//             this.dictionaryService.addOrUpdateItem('modifyAccessRows', JSON.stringify(this.modifyAccessRows));
//         }
//         queryList = queryList.sort(function (a, b) {
//             a = a.displayText.toLowerCase();
//             b = b.displayText.toLowerCase();
//             return a < b ? -1 : a > b ? 1 : 0;
//         });
//         return queryList;
//     } 
//     private securityCheck() {
//         if (!this.applicationSecurityService.userPermissions.FunctionPermissions.QueryOperatons) {
//             return;
//         }
//         if (this.currentUser.SuperReader == true && this.currentUser.SuperWriter == false) {
//             this.isAllowModifyQuery = true;
//             this.isAllowAddQuery = true;
//         }
//         else if (this.currentUser.SuperReader == false && this.currentUser.SuperWriter == false) {
//             if (this.applicationSecurityService.userPermissions.FunctionPermissions.QueryOperatons.CanCreateQueries === false) {
//                 this.isAllowModifyQuery = true;
//                 this.isAllowAddQuery = true;
//             }
//         }
//         else {
//             if (this.applicationSecurityService.userPermissions.FunctionPermissions.QueryOperatons.CanCreateQueries === false) {
//                 this.isAllowModifyQuery = true;
//                 this.isAllowAddQuery = true;
//             }
//         }
//     }
// }
// class QueryListState {
//     queryId: string = '';
//     pageNumber: number = 1;
//     pageLength: 10 | 20 | 40;
//     sortColumnName: string = '';
//     sortDescending: boolean = false;
//     filters: IColumnSearch[] = [];
//     bodyScrollTop: number = 0;
//     cursorWait: string = 'wait';
//     cursorDefault: string = 'default';
// }