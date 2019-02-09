import { Component, OnInit, ViewChild,OnDestroy,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {NotificationService,NavigationService,DetailsFormBaseComponent,BhControl,
        CustomValidators ,ParserHelper,ModalRComponent,IColumnDefinition,UnificationAPIService} from '../../shared/index';
import { TestModel } from './test.model';
import { TestAPIService } from './test.api.service';
import { LoginAudiAPIService } from './loginAudit.api.service';
import { AuthRoute } from '../../shared/auth-route';
//import { UnificationAPIService } from 'shared/services/unification.api.service';
@Component({
    templateUrl: 'test.component.html',
    providers: [TestAPIService,LoginAudiAPIService]
})

export class TestComponent  extends DetailsFormBaseComponent implements OnInit, OnDestroy 
{
private accountNumber:string =sessionStorage.getItem('accountNumber');
private selectorType = [{ Id: 0, Label: "Search for Client" }, { Id: 1, Label: "Upload CSV File" }]
private model: TestModel = new TestModel();
@ViewChild("modal") modal: ModalRComponent;
@ViewChild('fileInput') fileInput: ElementRef;
private formTitle = 'Global Settings';
private Title: string = "saurabh prata singh";
public fileToBeUploaded: any = {};
 private updateForm2 = true;
 private showCheckboxBtn: boolean = true;
 private showSelectRowBtn: boolean = true;
private entityIdentificationDataModel =
[{Id: "1E0866E0-214C-4BB6-8FEE-12C0743AD0C4", SubjectID: "BAB46B84-AFFE-43E5-B47A-FDC60E90094F", SubjectFullName: "Szyslak, Moe", Capacity: "Borrower", IsSigner: "false",
Contacts:[{Id: "1E0866E0-214C-4BB6-8FEE-12C0743AD0C4", SubjectID: "BAB46B84-AFFE-43E5-B47A-FDC60E90094F", SubjectFullName: "Szyslak, Moe", Capacity: "Borrower", IsSigner: "false"},
{Id: "494D4BFD-E4BF-4884-9495-A363E78FD924", SubjectID: "1448DDB1-F049-4BE1-ADEF-B38E3F252986", SubjectFullName: "May, Sally", Capacity: "Endorser", IsSigner: "false"},
{Id: "494D4BFD-E4BF-4884-9495-A363E78FD924", SubjectID: "1448DDB1-F049-4BE1-ADEF-B38E3F252986", SubjectFullName: "May, Sally", Capacity: "Endorser", IsSigner: "false"},
{Id: "494D4BFD-E4BF-4884-9495-A363E78FD924", SubjectID: "1448DDB1-F049-4BE1-ADEF-B38E3F252986", SubjectFullName: "May, Sally", Capacity: "Endorser", IsSigner: "false"}]
},
{Id: "E17C93C6-93D2-4ECA-B513-709F6C27E568", SubjectID: "6ECD858D-BD0A-492A-B32B-6AF5FC311088", SubjectFullName: "Abernathy Marketing Groups", Capacity: "Endorser", IsSigner: "false"},
{Id: "AB3B46E8-A3CE-47A1-A922-248888BF7BAE", SubjectID: "B3024BC4-D29D-4ED1-89E4-77C23B04A8F2", SubjectFullName: "Chalk, Art", Capacity: "Partner", IsSigner: "false"},
{Id: "74C63315-1E29-40B0-9604-2A66AA563CB9", SubjectID: "34EFF2B6-25C1-403D-AA6D-DAF7458972C4", SubjectFullName: "Dortisi, Robert", Capacity: "Guarantor", IsSigner: "false"},
{Id: "494D4BFD-E4BF-4884-9495-A363E78FD924", SubjectID: "1448DDB1-F049-4BE1-ADEF-B38E3F252986", SubjectFullName: "May, Sally", Capacity: "Endorser", IsSigner: "false"},
{Id: "B9795DB5-B324-4BA2-87A3-2C31A69C1E9E", SubjectID: "29D9AC90-C2F8-4AA0-856D-79A8DCEAA3A9", SubjectFullName: "McCormick, Pat", Capacity: "Endorser", IsSigner: "false"},
{Id: "B9795DB5-B324-4BA2-87A3-2C31A69C1E9E", SubjectID: "29D9AC90-C2F8-4AA0-856D-79A8DCEAA3A9", SubjectFullName: "McCormick, Pat", Capacity: "Endorser", IsSigner: "false"},
{Id: "B9795DB5-B324-4BA2-87A3-2C31A69C1E9E", SubjectID: "29D9AC90-C2F8-4AA0-856D-79A8DCEAA3A9", SubjectFullName: "McCormick, Pat", Capacity: "Endorser", IsSigner: "false"},
{Id: "B9795DB5-B324-4BA2-87A3-2C31A69C1E9E", SubjectID: "29D9AC90-C2F8-4AA0-856D-79A8DCEAA3A9", SubjectFullName: "McCormick, Pat", Capacity: "Endorser", IsSigner: "false"},
{Id: "B9795DB5-B324-4BA2-87A3-2C31A69C1E9E", SubjectID: "29D9AC90-C2F8-4AA0-856D-79A8DCEAA3A9", SubjectFullName: "McCormick, Pat", Capacity: "Endorser", IsSigner: "false"},
{Id: "B9795DB5-B324-4BA2-87A3-2C31A69C1E9E", SubjectID: "29D9AC90-C2F8-4AA0-856D-79A8DCEAA3A9", SubjectFullName: "McCormick, Pat", Capacity: "Endorser", IsSigner: "false"}]
private whereClauseGridColumns: IColumnDefinition[];
private isTreeView: boolean = true;
private isTreeViewHierarchicalData: boolean = true;
 private data: any;
private data2: any;
constructor(
protected notificationService: NotificationService,
protected navigationService: NavigationService,
private router: Router,
private formBuilder: FormBuilder,
private testAPIService:TestAPIService,
private loginAudiAPIService:LoginAudiAPIService,
private baseService: UnificationAPIService,)
{
       super(notificationService, navigationService);
         this.data = {
            service: new TestAPIService(baseService),
            sectionName: 'Tasks Chain',
            actions: this.actions,
            navigateRoute:  <AuthRoute>{ primary: 'taskChaindetails/:id' }, //Edit // null,
            navigateNewRoute: <AuthRoute>{ primary: 'taskChainadd' }, //Add   //null,
            innerControlType: 'bhrtable'
        }
         this.data2 = {
           service: new LoginAudiAPIService(baseService),
            sectionName: 'Login Audit',
            actions: this.actions,
            navigateRoute:  <AuthRoute>{ primary: 'taskChaindetails/:id' }, //Edit // null,
            navigateNewRoute: <AuthRoute>{ primary: 'taskChainadd' }, //Add   //null
            innerControlType: 'bhrtable' 
           // innerControlType: 'bhrtree'
        }
}
ngOnInit(): void {
		this.isLoading =false;
        this.buildForm();
         this.controlList.opportunityTypeControl.data.options = this.array.map(item => ({
                Id: item.Id,
                Label: item.label
            }));
            this.form.controls[this.controlList.updatedDateControl.key].setValue( new Date() );
            this.initializColumns();
}
controlList = {
     fullnNameControl: {
            label: 'Full Name',
            data: {
                propertyNames: {
                    fullName: 'FullName',
                    title: 'NamePrefix',
                    firstName: 'FirstName',
                    middleName: 'MiddleName',
                    lastName: 'LastName',
                    suffix: "NameSuffix"
                },
                model: this.model
            },
            validators: [Validators.required]
        },
     IsTermsConditionsControl: <BhControl>{
            key: 'IsTermsConditions',
            label: 'I agree to the terms and conditions above.',
        },
        nameControl: <BhControl>{
            key: 'Name',
            label: 'Name',
        },
         dunBradstreetBusinessMatchThresholdControl: <BhControl>{
            key: 'DunBradstreetBusinessMatchThreshold',
            label: 'Business Match Threshold',
            data: { value: null, parseType: 'percent2' },
           validators: [CustomValidators.rangeValidator(0, 100)],
           validationMessages: { 'rangeValidator': 'Value can not be greater that 100.' }
        },
        dunBradstreetBusinessMatchThreshold2Control: <BhControl>{
            key: 'DunBradstreetBusinessMatchThreshold2',
            label: 'Business Match Threshold2',
             data: { value: '', parseType: 'percent' }
        },
         globalSubscriberNumberControl: <BhControl>{
            key: 'GlobalSubscriberNumber',
            label: 'Global Subscriber Number',
            data: { value: '', maxLength: 5 }, parseFunction: ParserHelper.parseAlphaNumericValue
        },
         DescriptionControl: <BhControl>{
            key: 'Description',
            label: 'Description ',
            data: { value: '' }
        },
         NoteControl: <BhControl>{
            key: 'Note',
            label: 'Notes',
            data: { value: '' }
        },
         PaymentAmountControl: <BhControl>{
            key: 'PaymentAmount',
            label: 'Payment Amount',
            data: { value: '', parseType: 'currency' }
        },
        opportunityTypeControl: <BhControl>{
            key: 'OpportunityTypeId',
            label: 'Opportunity Type',
            data: { value: '', options: [] }
        },
         SelectorOptionTypeControl: <BhControl>{
            key: 'SelectorOption',
            label: 'Select Option',
            data: { value: 0, options: this.selectorType, inline: true },
            validators: [Validators.required]
        },
         updatedDateControl: <BhControl>{
            key: 'DecisionUpdateDate',
            label: 'Updated Date',
            data: { value: '',type: 'datetime'  }
        },
         establishedDateControl: <BhControl>{
              key: 'EstablishedDate',
               label: 'Date Established'
             },
        EmailControl: <BhControl>{
            key: 'EmailAddress',
             label: 'E-mail', data: {  type: 'email' },
            validators: [Validators.required,
            CustomValidators.emailValidator
            ]
        },
        ServerNameControl: <BhControl>{
            key: 'CalendarServer',
            label: 'Server',
            data: { value: '', maxLength: 50 },
          
        },
        PhoneControl: <BhControl>
        {
            key: 'PhoneNumber',
            label: 'Phone',
            data: { maxLength: 31, value: this.model.PhoneNumber, type: 'tel' },
            parseFunction: ParserHelper.parsePhone
        },
          taxIdControl: <BhControl>{
            key: 'TaxId',
            label: 'Social Security Number',
            data: { maxLength: 11, value: '' },
            parseFunction: ParserHelper.parseMaskedSSN,
            validators: [CustomValidators.regExValidator(/^((?!000|9\d{2})\d{3}([ \-]?)(?!00)\d{2}([ \-]?)(?!0{4})\d{4})?$|null/)],
            validationMessages: { 'regExValidator': 'SSN has 9 digits.' }
        },
         primaryAddressControl: {
            label: 'Primary Address',
            data: {
                propertyNames: {
                    line1: 'PrimaryAddressLine1',
                     line2: 'PrimaryAddressLine2',
                     line3: 'PrimaryAddressLine3',
                     line4: 'PrimaryAddressLine4',
                     line5: 'PrimaryAddressLine5',
                    city: 'PrimaryAddressCity',
                    stateCode: 'PrimaryAddressStateCode',
                    postalCode: 'PrimaryAddressPostalCode',
                    county: 'PrimaryAddressCounty',
                    countryCode: 'PrimaryAddressCountryCode',
                    fullAddress: 'PrimaryAddressFullAddress'
                },
                model: this.model
            },
            validators: [Validators.required]
        },
        primaryTeamMemberNameControl: <BhControl>{
            key: 'PrimaryTeamMemberName',
            label: 'Primary Team Member',
            data: {
                propertyNames: {
                    searchId: 'PrimaryTeamMemberName'
                },
                service: this.loginAudiAPIService,
                serviceModelTextProperty: 'message',
                serviceModelValueProperty: 'id',
                serviceGetByIdMethod: 'getById',
                model: this.model
            },
        }, 
         serviceProvidersControl: <BhControl>{
            key: 'ClientServiceProviderTypeId',
            label: 'Services Provided',
            data: {

                propertyNames: {
                    searchId: 'ClientServiceProviderTypeId'
                },
                service: this.testAPIService,
                serviceModelTextProperty: 'message',
                serviceModelValueProperty: 'id',
                serviceGetByIdMethod: 'getByIds',
                model: this.model,
                disabledValues: [],
                isMultiSelect: true
            }
        }
};
 actions: any[] = [
        {
            class: 'fa fa-cog',
            label: 'Edit Schedule',
            action: () => this.onEditScheduleSystems(),
            isDisabled: true,
            type: 'ACTION_TYPE_Edit_Schedule_SYSTEM'
        },
        {
            class: 'fa fa-history',
            label: 'View Audit History',
            action: () => this.onViewAuditHistory(),
            isDisabled: false,
            type: 'ACTION_TYPE_TASKS_AUDIT_HISTORY'
        }
    ];
     public onViewAuditHistory(): void
    {
        // if (this.bhSection != undefined)
        // {
        //     this.bhSection.onRefresh();
        // }
        // this.modalTaskAuditHistory.show();
    };
     private onEditScheduleSystems(): void
    {
       // this.getData();
    };
private array = [
    {Id: "", label: "", listOrder: 0},
{Id: "c4a8f055-5a6c-4971-8719-2d41d829fce1", label: "Add New Line(s)", listOrder: 1},
{Id: "e54c9eda-48b3-42bd-8c3c-ee6d0c857550", label: "Open Additional Location(s)", listOrder: 2},
{Id: "10182226-cc29-49f0-9e3d-3999eff17225", label: "Pay Down Debt", listOrder: 3},
{Id: "3023878d-6436-446c-8299-4f6fa695c860", label: "Search for Buyer", listOrder: 4},
{Id: "da912816-0a03-4106-b0ab-f455b1e4bb99", label: "Sustain Equipment/Premises", listOrder: 5}
]
 private buildForm(): void {
        this.form = this.formBuilder.group(this.model);
    };
 private onDelete(closeFunction){}
  private showChecklist(){}
protected hasChanges()
{
        return true;
};
 private onSave(closeFunction) {}
 onClose(): void {}
 private getData() {}
   private onSaveAndClose(event): void {
        this.onSave(event);
    };
   private onShowAddNewProduct(): void
    {this.isLoading = true;
         this.modal.show();
         this.isLoading = false;
    };
  private onHideAddNewProduct(): void
    {this.isLoading = true;
         this.modal.hide();
         this.isLoading = false;
    };
   private  onFileSelected(e)
  {
  let files = e.target.files || e.dataTransfer.files;
        if (files.length > 1) {
            this.notificationService.error('Only one file at a time, please');
            return;
        }
        if (files.length == 0) {
            this.fileToBeUploaded = {};
            this.form = this.formBuilder.group({ Id: null });
            this.form.markAsPristine();
            return;
        }
        this.fileToBeUploaded = files[0];
        let fileName = this.fileToBeUploaded.name;
        let newMessage = '';
    }
private onTabSelected(event) {
    if (event.title === "Bank Defined Fields") {
        }
}
onEditRow(rowObject) {}
onSelectedRowIdsChange(selectedRowIds: string[]) {
    var selectedRowIds = selectedRowIds;
}
 initializColumns() {
        this.whereClauseGridColumns = [
            {
                DisplayText: 'Client Name',
                ColumnName: 'SubjectFullName',
                DataType: 'string'
            },
            {
                DisplayText: 'Borrowing Capacity',
                ColumnName: 'Capacity',
                DataType: 'string'
            },
            {
                DisplayText: 'Signer?',
                ColumnName: 'IsSigner',
                DataType: 'checkmark',
                disableFilter: true,
                disableSort: true
            },
            {
                DisplayText: 'Address',
                ColumnName: 'Address',
                DataType: 'string'
            },
            {
                DisplayText: 'Address Type',
                ColumnName: 'addresstype',
                DataType: 'string'
            }
        ];
    }

onGrid()
{
     this.router.navigateByUrl('/auth/portfolio/(producthistoryfieldaudithistory)');
}   
}