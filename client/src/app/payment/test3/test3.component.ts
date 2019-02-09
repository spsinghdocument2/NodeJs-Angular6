import { Component, OnInit, ViewChild,OnDestroy,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {NotificationService,NavigationService,DetailsFormBaseComponent,BhControl,
        CustomValidators ,ParserHelper,ModalRComponent,IColumnDefinition,UnificationAPIService} from '../../shared/index';

@Component({
    templateUrl: 'test3.component.html'
})

export class Test3Component  extends DetailsFormBaseComponent implements OnInit, OnDestroy 
{
private formTitle: string = '';
 private modelId: string = null;

constructor(
protected notificationService: NotificationService,
protected navigationService: NavigationService,
private router: Router,
private formBuilder: FormBuilder,
private route: ActivatedRoute,)
{      
super(notificationService, navigationService);
 // Get the action and id from the route
        switch (this.route.snapshot.data['action']) {
            case 'add':
                this.updateForm = false;
                this.canDelete = false;
                this.formTitle = 'New Task Chain';
                break;
            case 'update':
                this.updateForm = true;
                this.formTitle = 'Task Chain';
                this.canDelete = true;
                this.modelId = this.route.snapshot.params['id'];
                break;
            default:
                throw new TypeError('This form was not called correctly');
        };
}
ngOnInit()
{
		this.isLoading =false;
}
private buildForm() {
        //this.form = this.formBuilder.group(this.model);
    };
protected hasChanges()
{
        return true;
};
}