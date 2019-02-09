import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl  } from '@angular/forms';
import { LoginModel } from './login.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService} from './shared/authorization.Service';
import {NotificationService} from './shared/services/notification.service';
import { BhControl } from './shared/controls/helpers/bh-control.class';
import { DetailsFormBaseComponent } from './shared/components/details-form-base.class';
import {NavigationService} from './shared/services/navigation.service';

@Component({
    templateUrl: 'login.component.html',
    providers: [AuthorizationService]
})
export class LoginComponent extends DetailsFormBaseComponent implements OnInit{ 
   private model: LoginModel = new LoginModel();

	 constructor(
		 private authService: AuthorizationService,
		 private router: Router,		  
		 private formBuilder: FormBuilder,
		 protected notificationService: NotificationService,
		 protected navigationService: NavigationService)
		{
			  super(notificationService, navigationService);
		   }
	ngOnInit(): void {
		this.buildForm();
		this.isLoading =false;
	}
	controlList = {
        userNameControl: <BhControl>{
            key: 'accountNumber',
            label: 'Account Number',
			 validators: [Validators.required],
        },
        passwordControl: <BhControl>{
            key: 'password',
            label: 'Password',
			 data: { type: 'password', maxLength: 20 },
			  validators: [Validators.required],
        },
		emailControl: <BhControl>{
            key: 'email',
            label: 'Email (username)',
			 validators: [Validators.required],
        }
	};
	 private buildForm(): void {
        this.form = this.formBuilder.group(this.model);
    };
	  // override base class hasChanged, this is required
    protected hasChanges()
    {
        let model = this.getUpdatedModel();
        return (model !== null);
    };
	 get canSave(): boolean {
        return (this.hasChanges && this.form.valid)
    }
	  private getUpdatedModel()
    {

    };
	onSubmit() {	
	    this.isLoading =true;
		 this.model = this.form.getRawValue() as LoginModel;
		 this.authService.login(this.model).subscribe((response) => {
		 this.isLoading =false;
		 if(response.object.login)
		 {
		// this.router.navigateByUrl('/auth/portfolio/(home)');
		 // this.router.navigateByUrl('/auth/portfolio/(home//section:producthistoryfieldaudithistory)');
		 this.router.navigateByUrl('/auth/lending/(home//section:producthistoryfieldaudithistory2)');
        
		 }
		 else
		 {	
		 this.notificationService.error(response.object.message);
		}
		  }, error =>
         {
         this.isLoading =false;
		 this.notificationService.errorMessage(error);
                });

    }
}
