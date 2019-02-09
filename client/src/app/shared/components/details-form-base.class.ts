import { OnDestroy, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

declare var moment: any;
import { AppFunctions } from '../app.functions';
import { NotificationService } from '../services/notification.service';
import { CanComponentDeactivate } from '../guards/can-deactivate.guard';
import { NavigationService } from '../services/navigation.service';
import { INavigationPoint } from '../services/navigation.service';

import {ComponentBase} from './component-base';

export abstract class DetailsFormBaseComponent extends ComponentBase {
    updateForm: boolean = true; // default to update (as opposed to add)
    isReady = true;
    form: FormGroup;
    isLoading: boolean = true;
    canDelete: boolean = true;
    hideDelete: boolean = true;
    canDuplicate: boolean = true;
    isAccept: boolean = true;
    isRelease: boolean = true;
    canAdvance: boolean = true;
    canComplete: boolean = true;
    protected ignoreUnsavedChanges: boolean = false;
    

    constructor(
        protected notificationService: NotificationService,
        protected navigationService: NavigationService
    ) {
        super();
    }



    // this is a convenience, so everyone doesn't have to write this repeatedly
    protected newObserver = new Observable(observer => {
        observer.next();
        observer.complete();
    });

    // this must be implemented in the inherited form
	/* Example:
		hasChanges() {
			let model = this.getUpdatedModel();
			return (model !== null);
		}
	*/
    protected abstract hasChanges(): boolean;

    protected getUpdatedModelFromForm(sourceModel: any, form: FormGroup, modelProperties: any): any {
        return AppFunctions.modelParser(sourceModel, form.getRawValue(), modelProperties);
    }

    protected isModelChanged(sourceModel: any, updatedModel: any, modelProperties: any): boolean {
        return AppFunctions.isUpdated(sourceModel, updatedModel, modelProperties);
    }

    protected isFormDirty(form: FormGroup): boolean {
        let formIsDirty: boolean = false;
        if (form != null && form != undefined) {
            formIsDirty = form.dirty;
        }
        return formIsDirty;
    }

    protected isFormValid(form: FormGroup): boolean {
        let formIsValid: boolean = false;
        if (form != null && form != undefined) {
            formIsValid = form.valid;
        }
        return formIsValid;
    }

    protected updateNavigation(navigationPoint: INavigationPoint) {
        this.navigationService.addNavigationPoint(navigationPoint);
    }

    protected isLoggedOut(): boolean {
        // duplicated from UnificationAPIService so we don't have to include that in the constructor
        let logoutAt = sessionStorage.getItem('expires_at');

        let result = true;
        if (logoutAt) {
            let logoutAtAsMoment = moment.utc(logoutAt, moment.ISO_8601);
            let nowAsUtc = moment.utc();

            if (nowAsUtc.isBefore(logoutAtAsMoment)) {
                result = false;
            }
            //console.log('DetailsFormBaseComponent.isLoggedOut(): ' + result.toString() + '   nowAsUtc: ' + nowAsUtc.format() + '   logoutAtAsMoment: ' + logoutAtAsMoment.format());
        }
        //else console.log('DetailsFormBaseComponent.isLoggedOut(): true - logoutAt is null');

        return result;
    }

    @HostListener('window:beforeunload', ['$event'])
    onBrowserNavigate($event) {
        //console.log('DetailsFormBaseComponent.onBrowserNavigate(): Enter');
        // this is the browser being navigated away from the app
        // because of browser security we can only supply the text of the warning
        // Note: currently it doesn't seem to matter what text I return
        if (this.ignoreUnsavedChanges || this.isLoggedOut()) {
            return true;
        }

        let unsavedChanges = this.hasChanges();
        //console.log('DetailsFormBaseComponent.onBrowserNavigate(): unsavedChanges: ' + (unsavedChanges || false).toString());

        if (unsavedChanges) {
            $event.returnValue = 'You have unsaved changes.';
        }
    }
    canDeactivate() {
        //console.log('DetailsFormBaseComponent.canDeactivate(): Enter');
        if (this.ignoreUnsavedChanges || this.isLoggedOut()) {
            return true;
        }

        let unsavedChanges = this.hasChanges();
        //console.log('DetailsFormBaseComponent.canDeactivate(): unsavedChanges: ' + (unsavedChanges || false).toString());

        //return (!unsavedChanges) ?
          //  true :
           // this.notificationService.configureAlertify('You have unsaved changes.')
                // .then((response) => {
                //     //console.log('DetailsFormBaseComponent.canDeactivate(): You have unsaved changes: ' + response.buttonClicked.toString());
                //     return (response.buttonClicked === 'ok');
                // });
    }

    protected onClose() {
        this.ignoreUnsavedChanges = true;
    }
}