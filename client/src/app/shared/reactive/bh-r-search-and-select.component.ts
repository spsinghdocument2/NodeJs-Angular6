import {
    Component, OnInit, OnChanges, Input, Output, EventEmitter, Renderer, AfterViewInit, SimpleChanges, ReflectiveInjector,
    ViewChild, ChangeDetectorRef, ViewContainerRef, ComponentFactoryResolver, ComponentRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { BhControl } from '../controls/helpers/bh-control.class';
import { AppFunctions } from '../app.functions';
import {
    ModalRComponent
} from '../Index';

@Component({
    selector: 'bh-r-search-and-select',
    templateUrl: 'bh-r-search-and-select.component.html'
})
export class SearchAndSelectRComponent implements OnInit {
    @ViewChild(ModalRComponent) private modalDialog: ModalRComponent;
    @ViewChild('table') private tableView;
    @Input() bhControl: BhControl;
    @Input() form: FormGroup;
    @Input() disabledValues: string[]; // this expects an array of guids (as strings)
    @Input() btnClass: string = "btn-blue";
    @Input() iconClass: string = "fa-plus";
    @Input() iconTooltip: string = "Select";
    @Input() isMultiSelect: boolean = false;
    @Input() isPlusOnlyDisplayed: boolean = false;
    @ViewChild('table') table; 
    @Output() selectedRowDisplayText = new EventEmitter();
    @Output() selectedRowValue = new EventEmitter();
    @Output() OnModalClose = new EventEmitter();
    @Output() OnClear = new EventEmitter();
    @Output() checkRow = new EventEmitter();
    @Output() selectedRowsIdsChange = new EventEmitter();
    @Input() showRightColumn: boolean = false;
    @Input() showControlInMoreAction: boolean = false;
    @Input() service: boolean = false;
    @Input() innerControlType: string = 'bhrtable'; 
    @Output() clearChecked = new EventEmitter();
    private initialSearch: boolean = false;
    @Output() selectedRowId = new EventEmitter();
    validationMessage: string = '';
    displayText: string = '';
    displayText2: string = '';
    private serviceModelTextProperty: string;
    private serviceModelValueProperty: string;
    private serviceGetByIdMethod: string;
    private selectedRows: any[] = [];
    private allRows: any = [];
    private allRowsAfterSort: any = [];
    private modelProperties: any = {
        searchId: ''
    };
    private isSearchAndSelect: boolean = true;
    private documentClickListener: any;
    private updatingPartial: boolean = false;
    private updatingFull: boolean = false;
    private updatingSearchIdInternal: boolean = false;
    protected isRequired: boolean = false;
    private displayData: any[] = [];
    private isSortSelected: boolean = false;
    @ViewChild('dynamicContent', { read: ViewContainerRef }) dynamicContent: ViewContainerRef;
    @Output() OnModalAddNew = new EventEmitter();
    @Input() modalTitle: string = null;
    componentRef: ComponentRef<any>;
    showAdd: boolean = false;
    showList: boolean = true;
    loadGrid: boolean = false;
    showTreeView: boolean = false;
    isLoading: boolean = false;
    private showEditButton: boolean = false;
    private showDeleteButton: boolean = false;
    private childItemsPath: string = null;
    @Input() selectedRowIds: any = [];
    checkedRowIds: any = [];
    itemsToEnable: any = [];
    private numberOfRowSelection: number = null;
   

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {
    }

    selectedRow(selectedData) {
        let control = this.form.controls[this.modelProperties.searchId];
        let selectedItemDisplayText = "";
        let selectedItemValue = "";
        if (!this.showControlInMoreAction) {
            if (this.innerControlType == 'bhtable') {
                if (selectedData.length != null) {
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedItemDisplayText = selectedItemDisplayText + "," + AppFunctions.traverseModelForProperty(selectedData[i], this.serviceModelTextProperty);
                        selectedItemValue = selectedItemValue + "," + AppFunctions.traverseModelForProperty(selectedData[i], this.serviceModelValueProperty);
                    }
                }
                else {
                    selectedItemDisplayText = AppFunctions.traverseModelForProperty(selectedData, this.serviceModelTextProperty);
                    selectedItemValue = AppFunctions.traverseModelForProperty(selectedData, this.serviceModelValueProperty);
                }
            }
            else {
                selectedItemDisplayText = AppFunctions.traverseModelForProperty(selectedData, this.serviceModelTextProperty);
                selectedItemValue = AppFunctions.traverseModelForProperty(selectedData, this.serviceModelValueProperty);
            }
            if (!this.isMultiSelect) {
                // update the display text
                this.displayText = selectedItemDisplayText;
                // update the control and model
                this.updatingSearchIdInternal = true;
                if (control != undefined) {
                    control.setValue(selectedItemValue);
                    control.markAsDirty();
                } // setValue() isn't making it dirty so this is our current work around
                this.updatingSearchIdInternal = false;
            }
            else {
                let isInDisabledList = (this.disabledValues == null) ? false : this.disabledValues.filter(x => x == selectedData.Id).length > 0;
                // update selectedRows and display text         
                if (selectedData.Disabled || isInDisabledList) { // if an item was de-selected
                    selectedData.Disabled = false;
                    this.selectedRows.splice(this.selectedRows.indexOf(selectedData[this.serviceModelValueProperty], 0), 1);
                    for (let i = 0; i < this.displayData.length; i++) {
                        if (this.displayData[i].Id == selectedData.Id)
                            this.displayData.splice(i, 1);
                    }
                    this.displayText = this.displayData.map(x => x.displayText.trim()).join(', ');

                    if (this.tableView.getData != null) {
                        this.tableView.getData(false);
                    }
                }
                else { // an item was selected
                    selectedData.Disabled = true;
                    this.selectedRows.push(selectedData[this.serviceModelValueProperty]);
                    this.selectedRows.length == 1 ? this.displayText = selectedItemDisplayText : this.displayText += ', ' + selectedItemDisplayText;
                    let rowSelected = {
                        Id: selectedData.Id,
                        displayText: selectedItemDisplayText,
                        isSelected: true,
                        Disabled: true
                    }
                    rowSelected[this.serviceModelTextProperty] = selectedItemDisplayText;
                    if (this.displayData.indexOf(rowSelected) == -1) {
                        for (let i = 0; i < this.displayData.length; i++)
                            this.displayData[i].isSelected = true;
                        this.displayData.push(rowSelected);
                    }
                }
                for (let i = 0; i < this.displayData.length; i++) {
                    this.displayData[i].isSelected = true;
                }
                this.displayText2 = this.displayText.replace(/ *, */g, '\n\n');

                // update the control and model
                this.updatingSearchIdInternal = true;
                control.setValue(this.selectedRows);
                this.bhControl.data.disabledValues = this.selectedRows;
                this.disabledValues = this.selectedRows;
                control.markAsDirty(); // setValue() isn't making it dirty so this is our current work around
                this.updatingSearchIdInternal = false;
            }
            this.selectedRowDisplayText.emit(this.displayText);
            this.selectedRowValue.emit(selectedItemValue);
            this.OnModalClose.emit(selectedData);
        }
        if (this.showControlInMoreAction) {
            this.onClose();
            this.OnModalClose.emit(selectedData);
        }
    };

    onClose() {
        this.showAdd = false;
        this.showList = true;
        if (!this.showControlInMoreAction && this.innerControlType != 'bhsectiontable' && this.innerControlType != 'bhtable') {
            this.loadGrid = true;
        } else {
            this.loadGrid = false;
        }
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        this.modalDialog.modalTitle = "";
        if (!this.showControlInMoreAction)
        this.OnModalClose.emit(this.displayData);
    }

    selectedRowCheck(display) {
        display.isSelected = false;
        if (this.tableView.rowClicked != null) {
            this.tableView.rowClicked(display);
        }
        else {   
            this.selectedRow(display);            
        }
    }

    filterSelectedRows($event) {
        this.allRows = $event;
        if (this.isMultiSelect)
            this.selectedRows = this.bhControl.data.disabledValues;
        if (this.bhControl.data.innerControlType == undefined || this.bhControl.data.innerControlType == null || this.bhControl.data.innerControlType == 'bhrtable') {
            if (this.bhControl.data.disabledValues != null && this.bhControl.data.disabledValues.length > 0) {
                let itemsToDisable = AppFunctions.arrayIntersect($event, x => x[this.serviceModelValueProperty], this.bhControl.data.disabledValues, x => x);
                for (let item of itemsToDisable) {
                    item.Disabled = true;
                }
            }
        }
        else if (this.bhControl.data.innerControlType == 'bhrtree') {
            if (this.bhControl.data.disabledValues != null && this.bhControl.data.disabledValues.length > 0) {
                let itemsToDisable = AppFunctions.arrayIntersectRecurssive($event, x => x[this.serviceModelValueProperty], this.bhControl.data.disabledValues, x => x, []);

                for (let item of itemsToDisable) {
                    item.Disabled = true;
                }
            }
        }
        else if (this.bhControl.data.innerControlType == 'bhsectiontable') {
            if (this.bhControl.data.disabledValues != null && this.bhControl.data.disabledValues.length > 0) {
                let itemsToDisable = AppFunctions.arrayIntersect($event, x => x[this.serviceModelValueProperty], this.bhControl.data.disabledValues, x => x);
                for (let item of itemsToDisable) {
                    item.isSelected = true;
                }      
            }
        }
    }

    onSearchIdChanged(newValue) {
        if (newValue) {
            this.selectedRowId.emit(newValue);
        } 
        if (this.updatingSearchIdInternal) {
            return;
        }
        if (!newValue || newValue.length == 0) {
            this.displayText = '';
            this.displayText2 = '';
            this.onModalClear();
            this.selectedRowDisplayText.emit(this.displayText);
        }
        else {
            let service: any;
            if (this.bhControl.data.serviceMethod)
                service = this.bhControl.data.serviceMethod;
            else
                service = this.bhControl.data.service;

            service[this.serviceGetByIdMethod](newValue)
                .subscribe(data => {
                    if (data.value!=undefined && data.value) {      
                        if (this.bhControl.data.lookUpId) {
                            this.serviceModelTextProperty = this.bhControl.data.serviceModelTextProperty;
                        }

                        this.displayText = data.value[0][this.serviceModelTextProperty];
                        this.changeDetectorRef.markForCheck();
                    }
                    else {
                        this.displayText = data[this.serviceModelTextProperty];
                        this.changeDetectorRef.markForCheck();
                        //******for assigning value to rightside in case of isMultiSelect true************//
                        if (this.isMultiSelect && this.innerControlType !== 'bhsectiontable') {
                            for (let item = 0; item < newValue.length; item++) {

                                let refreshData = {
                                    Id: newValue[item],
                                    displayText: this.displayText.split(',')[item],
                                    isSelected: true
                                }
                                refreshData[this.serviceModelTextProperty] = this.displayText.split(',')[item];
                                let isExist = false;
                                for (let rightSideData = 0; rightSideData < this.displayData.length; rightSideData++) {
                                    if (refreshData.Id == this.displayData[rightSideData].Id) {
                                        isExist = true;
                                        break;
                                    }
                                }
                                if (!isExist)
                                    this.displayData.push(refreshData);
                                if (!this.selectedRows.includes(refreshData.Id)) {
                                    this.selectedRows.push(refreshData.Id);
                                    this.disabledValues = this.bhControl.data.disabledValues = this.selectedRows;
                                }
                            }
                        }
                    }
                    this.selectedRowDisplayText.emit(this.displayText);
                }
                );
        }

        this.validate();
    }

    private validate() {
        let validationMessages = this.bhControl.validationMessages;
        let control = this.form.controls[this.modelProperties.searchId];

        this.validationMessage = '';

        if (control && !control.valid) {
            let messages = validationMessages || {};
            for (let key in control.errors) {
                var message = messages[key];
                // default messages
                if (!message) {
                    switch (key) {
                        case 'required':
                            message = this.bhControl.label + ' is required.';
                            break;
                        default:
                            message = 'Error';
                    }
                }

                this.validationMessage += `<p><i class="fa fa-exclamation-triangle"></i>${message}</p>`;
            }
        }
    }

    OnModalShow() {
        this.disabledValues = this.bhControl.data.disabledValues;
        this.modalDialog.show();
        this.loadGrid = true;
        this.isSortSelected = false;
        if (this.innerControlType !== 'bhsectiontable') {
           
            if (this.bhControl.data.options != null) {
                this.table.dataSubset = this.bhControl.data.options;
            }
            if (this.bhControl.data.serviceModelTextProperty != null && this.bhControl.data.serviceModelTextProperty != undefined && this.showControlInMoreAction) {
                this.serviceModelTextProperty = this.bhControl.data.serviceModelTextProperty;
               
            }
            if (this.table != null && this.table.getData && !this.showControlInMoreAction) {
                this.table.getData();
            }
        }
        //If user wants to display Add button in search-and-select
        if (this.bhControl.data.showAdd) {
            this.showAdd = this.bhControl.data.showAdd;
        }

        if (this.bhControl.data.lookUpId) {
            this.serviceModelTextProperty = this.bhControl.data.serviceModelTextProperty;
        }
        this.showList = true;
        this.changeDetectorRef.markForCheck();
    }

    onModalClear(markAsDirty: boolean = false) {
        this.displayData.length = 0;
        let control = this.form.controls[this.modelProperties.searchId];
        this.displayText = '';
        this.displayText2 = '';
        if (!this.isMultiSelect) {
            // update the control and model
            this.updatingSearchIdInternal = true;
            if (control.value != '') {
                control.setValue('');
                if (markAsDirty) {
                    control.markAsDirty(); // setValue() isn't making it dirty so this is our current work around
                }
            }
            this.updatingSearchIdInternal = false;
            this.modalDialog.hide();
        }
        else {
            // update the control and model
            this.updatingSearchIdInternal = true;
            this.disabledValues = [];
            this.selectedRows = [];
            if (this.innerControlType == undefined || this.innerControlType == null || this.innerControlType == 'bhrtable') {
                let itemsToEnable = AppFunctions.arrayIntersect(this.allRows, x => x[this.serviceModelValueProperty], this.bhControl.data.disabledValues, x => x);
                for (let item of itemsToEnable) {
                    item.isSelected = false;
                    item.Disabled = false;
                }

            }
            else if (this.innerControlType == 'bhrtree') {
                let itemsToEnable = AppFunctions.arrayIntersectRecurssive(this.allRows, x => x[this.serviceModelValueProperty], this.bhControl.data.disabledValues, x => x, []);

                for (let item of itemsToEnable) {
                    item.Disabled = false;
                }
            }
            else if (this.innerControlType == 'bhsectiontable') {
                this.loadGrid = false;
                setTimeout(() => this.loadGrid = true, 5);
                this.disabledValues = [];
                this.bhControl.data.disabledValues = [];
            }
            this.bhControl.data.disabledValues = [];
            if (control.value != '') {
                control.setValue(this.selectedRows);
                if (markAsDirty) {
                    control.markAsDirty(); // setValue() isn't making it dirty so this is our current work around
                }
            }
            else
            {
                control.setValue(this.selectedRows);
            }
            this.updatingSearchIdInternal = false;
        }
        this.selectedRowDisplayText.emit(this.displayText);
        this.OnClear.emit(true);
    }

    ngOnInit() {
        this.loadGrid = false;
        if (!this.showControlInMoreAction && this.innerControlType != 'bhsectiontable' && this.innerControlType != 'bhtable') {
            this.loadGrid = true;
        }
        if (!this.bhControl.data.serviceModelTextProperty) {
            throw new Error('The SearchAndSelectRComponent is missing bhControl.data.serviceModelTextProperty is missing, please config it in the BhControl structure');
        }
        if (!this.bhControl.data.serviceModelValueProperty) {
            throw new Error('The SearchAndSelectRComponent is missing bhControl.data.serviceModelValueProperty is missing, please config it in the BhControl structure');
        }
        if (!this.bhControl.data.serviceGetByIdMethod) {
            throw new Error('The SearchAndSelectRComponent is missing bhControl.data.serviceGetByIdMethod is missing, please config it in the BhControl structure');
        }
        if (!this.bhControl.data.propertyNames.searchId) {
            throw new Error('The SearchAndSelectRComponent is missing bhControl.data.propertyNames.searchId is missing, please config it in the BhControl structure');
        }
        this.innerControlType = (this.isMultiSelect) ? 'bhsectiontable' : 'bhrtable';
        if (this.bhControl.data.innerControlType != undefined && this.isMultiSelect) {
            this.innerControlType = (this.bhControl.data.innerControlType == 'bhrtable') ? 'bhsectiontable' : this.bhControl.data.innerControlType;
        }
        else
        {
            if (this.bhControl.data.innerControlType == 'bhrtree') {
                this.innerControlType = 'bhrtree';
            }
            if (this.bhControl.data.innerControlType == 'bhtable') {
                this.innerControlType = 'bhtable';
            }
        }
        this.showRightColumn = (this.innerControlType === 'bhsectiontable') ? false : true;
        this.serviceModelTextProperty = this.bhControl.data.serviceModelTextProperty;
        this.serviceModelValueProperty = this.bhControl.data.serviceModelValueProperty;
        this.serviceGetByIdMethod = this.bhControl.data.serviceGetByIdMethod;
        this.disabledValues = this.bhControl.data.disabledValues;
        var property;
        // can't be of type BhControl because of how it's used below
        let propertyNames = this.bhControl.data.propertyNames;
        let model = this.bhControl.data.model;

        this.modelProperties = propertyNames;

        if (model !== undefined && model !== null) {
            for (property in propertyNames) {
                let modelProperty = propertyNames[property];
                this.form.addControl(propertyNames[property], new FormControl(model[modelProperty]));
            }
        }

        if (this.bhControl.validators) {
            let hasRequired = this.bhControl.validators.filter(validator => {
                return (validator == Validators.required);
            });

            if (hasRequired.length === 1) {
                this.isRequired = true;
                this.form.controls[this.modelProperties.searchId].validator = Validators.required;
            }
        }
        if (model !== undefined && model !== null) {
            this.onSearchIdChanged(model[this.modelProperties.searchId]);
            this.form.controls[this.modelProperties.searchId].valueChanges
                .subscribe(data => this.onSearchIdChanged(data));
            this.validate();
        }
        this.showEditButton = false;
        this.showDeleteButton = false;
    }

    showAddComponent() {

        if (this.componentRef) {
            this.componentRef.destroy();
        }

        // Create factory of the passed in add component
        let factory = this.componentFactoryResolver.resolveComponentFactory(this.bhControl.data.component);

        // Create injector for compoent
        let injector = ReflectiveInjector.fromResolvedProviders([], this.dynamicContent.parentInjector);

        // create component without adding it directly to the DOM
        this.componentRef = this.dynamicContent.createComponent(factory, this.dynamicContent.length, injector);

        // add required inputs first !! otherwise component/template crashes ..
        this.componentRef.instance.showAddOnSearch = true;
        this.componentRef.instance.showHeader = false;


        // add system lookupid value so that component can be created accordingly while loading
        if (this.bhControl.data.lookUpId) {
            this.componentRef.instance.systemLookupId = this.bhControl.data.lookUpId;
            if (this.bhControl.data.modalTitle) {
                this.modalDialog.modalTitle = this.bhControl.data.modalTitle;
            } else {
                this.componentRef.instance.lookupFormTitle.subscribe(data => this.modalDialog.modalTitle = data);
            }
            this.serviceModelTextProperty = this.serviceModelTextProperty.toLowerCase();
        }
        else {
            //For other add components
            this.modalDialog.modalTitle = this.componentRef.instance.formTitle;
        }

        // all inputs set? add it to the DOM ..
        this.changeDetectorRef.markForCheck();

        // Subscribe to sendModel to get back the model after row is added
        this.componentRef.instance.selectedModel.subscribe(data => this.selectSavedRow(data));
    }

    onAdd() {
        this.showAdd = false;
        this.showList = false;

        // Display the add component passed in BHControl data
        this.showAddComponent();
        this.OnModalAddNew.emit();
    }

    onSave() {
        // Call onSave() of the add component passed  
        this.componentRef.instance.onSave();
    }

    selectSavedRow(value) {
         // When record from add component is saved after that model is returned to select that row in search-and-select
        this.showAdd = false;
        this.showList = false;
        this.loadGrid = false;
        if (this.componentRef) {
            this.componentRef.destroy();
        }

        this.selectedRow(value);
        this.modalDialog.modalTitle = "";
        this.modalDialog.hide(true);
    }

    toggleView() {
        setTimeout(() => this.isLoading = true, 5);
        this.tableView.setRows([]);
        this.showTreeView = !this.showTreeView;
        this.tableView.childItemsPath = (this.showTreeView) ? this.bhControl.data.childItemsPath : null;
        if (this.showTreeView == true) {
            this.table.initalPageLength = 999999;
        } else {
            this.table.initalPageLength = 10;
        }
        this.tableView.setRows(this.bhControl.data.rows);
    }


    onRowChecked(selectedRows) {
        this.isSortSelected = false;
        for (let i = 0; i < selectedRows.length; i++) {
            this.onCheck(selectedRows[i]);
        }
    }

    onCheck(selectedRow) {
        let control = this.form.controls[this.modelProperties.searchId];
        let selectedItemDisplayText = "";
        let selectedItemValue = "";
        var selectedData = selectedRow._data;
        selectedItemDisplayText = AppFunctions.traverseModelForProperty(selectedData, this.serviceModelTextProperty);
        selectedItemValue = AppFunctions.traverseModelForProperty(selectedData, this.serviceModelValueProperty);
        if (this.innerControlType == 'bhsectiontable') {
            if (!selectedRow.isSelected) {
                for (let i = 0; i < this.displayData.length; i++) {
                    if (this.displayData[i].Id == selectedData.Id)
                        this.displayData.splice(i, 1);
                }
                if (this.displayText != undefined && this.displayText != null) {
                    this.displayText = this.displayText.toString().trim();
                }
               if (this.displayText.includes(selectedItemDisplayText + ',')) {
                    this.displayText = this.displayText.replace(selectedItemDisplayText + ',', ''); // there are items after this one
               }
               else if (this.displayText.includes(selectedItemDisplayText + ', ')) {
                   this.displayText = this.displayText.replace(selectedItemDisplayText + ', ', ' '); // there are items after this one with space
               }
               else if (this.displayText.includes(', ' + selectedItemDisplayText)) {
                   this.displayText = this.displayText.replace(', ' + selectedItemDisplayText, ' '); // there are only items before this one with space
               }
                else if (this.displayText.includes(',' + selectedItemDisplayText)) {
                    this.displayText = this.displayText.replace(',' + selectedItemDisplayText, ''); // there are only items before this one
                }
                else {
                    this.displayText = this.displayText.replace(selectedItemDisplayText, ''); // there are no items before or after this one
                }
                    // Remove Comma from Last Index
               if (this.displayText != undefined && this.displayText != null) {
                   this.displayText = this.displayText.toString().trim();
                    if (this.displayText.endsWith(',')) {
                            this.displayText = this.displayText.substring(0, this.displayText.lastIndexOf(','));
                    }
                    //Remove comma from first Index
                    if (this.displayText.startsWith(',')) {
                        this.displayText = this.displayText.substring(1, this.displayText.length);
                    }
                }
            }
            else {
                // Remove Comma from Last Index
                if (this.displayText != undefined && this.displayText != null) {
                    this.displayText = this.displayText.toString().trim();
                    if (this.displayText.endsWith(',')) {
                        this.displayText = this.displayText.substring(0, this.displayText.lastIndexOf(','));
                    }
                    //Remove comma from first Index
                    if (this.displayText.startsWith(',')) {
                        this.displayText = this.displayText.substring(1, this.displayText.length);
                    }
                }
                this.selectedRowIds.length == 1 ? this.displayText = selectedItemDisplayText : (this.displayText == '') ? this.displayText += selectedItemDisplayText + ',' : this.displayText += ',' + selectedItemDisplayText;
                let rowSelected = {
                    Id: selectedData.Id,
                    displayText: selectedItemDisplayText,
                    isSelected: true
                }
                if (this.displayData.indexOf(rowSelected) == -1) {
                    this.displayData.push(rowSelected);
                }
            }
            // update the control and model
            this.updatingSearchIdInternal = true;
            control.setValue(this.selectedRowIds);
            this.bhControl.data.disabledValues = this.selectedRowIds;
            this.disabledValues = this.selectedRowIds;
            control.markAsDirty(); // setValue() isn't making it dirty so this is our current work around
            this.updatingSearchIdInternal = false;
        }
        if (this.selectedRowIds.length == 0) {
            this.displayText = '';
        }
        this.selectedRowDisplayText.emit(this.displayText);
    }

    onSelectedRowsIdsChange(selectedRowIds: string[]) {
        this.selectedRowIds = selectedRowIds;
        this.selectedRowsIdsChange.emit(this.selectedRowIds);
    }

    onClearChecked(selectedRows) {
        if (selectedRows!=undefined && selectedRows.length != 0) {
            this.onRowChecked(selectedRows);
        }
        else {
            this.displayData.length = 0;
            let control = this.form.controls[this.modelProperties.searchId];
            this.displayText = '';
            this.displayText2 = '';
            this.selectedRowIds = [];
            this.bhControl.data.disabledValues = [];
            this.disabledValues = [];
            this.updatingSearchIdInternal = true;
            if (control.value != '') {
                control.setValue(this.selectedRowIds);
                control.markAsDirty(); // setValue() isn't making it dirty so this is our current work around
            }
            else {
                control.setValue(this.selectedRowIds);
            }
            this.selectedRowDisplayText.emit(this.displayText);
            this.clearChecked.emit(selectedRows);
        }
    }

    onSort() {
        this.table.onSort();
        this.isSortSelected = true;
    }
}