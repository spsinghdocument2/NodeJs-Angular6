import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NotificationService } from '../services/notification.service';
import { NavigationService } from '../services/navigation.service';
import { EntityAction } from '../controls/helpers/entity-action.class';

@Component({
    selector: 'bh-r-entity-header',
    templateUrl: 'bh-r-entity-header.component.html'
})
export class EntityHeaderRComponent implements OnInit {
    @Input() form: FormGroup;
    @Input() forms: FormGroup[] = [];
    @Input() title: string = '';
    @Input() readOnly: boolean = false;
    @Input() saveHidden: boolean = false;
    @Input() saveCloseHidden: boolean = false;
    @Input() saveNewHidden: boolean = true;
    @Input() closeHidden: boolean = false;
    @Input() moreOptionsHidden: boolean = false;
    @Input() refreshText: string = "Refresh Fields";
    @Input() canDelete: boolean = true;
    @Input() canClose: boolean = false;
    @Input() canRefresh: boolean = true;
    @Input() deleteMessage: string = 'Are you sure you want to delete?'
    @Input() additionalActions: EntityAction[] = [];
    @Output() save: EventEmitter<Function> = new EventEmitter<Function>();
    @Output() saveandnew: EventEmitter<Function> = new EventEmitter<Function>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
    @Output() delete: EventEmitter<Function> = new EventEmitter<Function>();
    @Output() duplicate: EventEmitter<Function> = new EventEmitter<Function>();
    @Output() advance: EventEmitter<Function> = new EventEmitter<Function>();
    @Output() complete: EventEmitter<Function> = new EventEmitter<Function>();
    @Output() accept: EventEmitter<Function> = new EventEmitter<Function>(); //RXL
    @Output() release: EventEmitter<Function> = new EventEmitter<Function>(); //RXL

    // extra steps to scope correctly, otherwise the callback won't have a 'this'
    public theCloseCallback: Function;
    public theSaveAndCloseCallback: Function;
    public theDeleteCallback: Function;

    constructor(
        private notificationService: NotificationService,
        private navigationService: NavigationService) {
    }

    ngOnInit() {
        this.theCloseCallback = this.onClose.bind(this);
        this.theSaveAndCloseCallback = this.saveAndCloseCallback.bind(this);
        this.theDeleteCallback = this.deleteCallback.bind(this);
    }
    get canSave(): boolean {
        return (this.hasChanges && this.isValid);
    }

    get hasChanges(): boolean {
        let isChanged: boolean = false;

        // Check for forms array
        if (this.forms.length > 0) {
            for (var i = 0; i < this.forms.length; i++)
            {
                if (this.forms[i] != null && this.forms[i].dirty == true) {
                    isChanged = true;
                }
            }
        }

        // Check for single form
        if ((!isChanged) && (this.form)) {
            isChanged = (this.form.dirty === true);
        }
        return isChanged;
    }
    get isValid(): boolean {
        let formIsValid: boolean = true;
        // Check for forms array
        if (this.forms.length > 0) {
            for (var i = 0; i < this.forms.length; i++) {
                if (this.forms[i] && this.forms[i].valid === false) {
                    formIsValid = false;
                    break;
                }
            }

            if (!formIsValid) {
                return formIsValid; // Return result we don't need to check anything else.
            }
        }
        // Check for single form
        if (this.form) {
            formIsValid = (this.form.valid === true);
        }
        return formIsValid;
    }
    onSave() {
        this.save.emit(null);
    }
    onClose() {
        if (this.hasChanges && this.canClose != true && this.readOnly == false) {
            // this.notificationService.confirmUnsaved('You have unsaved changes.')
            //     .then((response) => {
            //         if (response.buttonClicked === 'ok') {                        
            //             this.close.emit();
            //             setTimeout(() => {
            //                 this.navigationService.navigateBack();
            //             }, 0);
            //         }
            //     });
        }
        else if (this.canClose) {
            this.close.emit();
        }
        else {            
            this.close.emit();
            setTimeout(() => {
                this.navigationService.navigateBack();
            }, 0);
        }
    }
    onSaveAndClose() {
        this.save.emit(this.theSaveAndCloseCallback);
    }
    onSaveAndNew() {
        this.saveandnew.emit(null);
    }
    onDuplicate() {
        this.duplicate.emit(null);
    }
    onAdvance() {
        this.advance.emit(null);
    }
    onComplete() {
        this.complete.emit(null);
    }
    onRefresh() {
        if (this.hasChanges) {
            // this.notificationService.confirmUnsaved('You have unsaved changes.')
            //     .then((response) => {
            //         if (response.buttonClicked === 'ok') {
            //             this.refresh.emit();
            //         }
            //     });
        }
        else {
            this.refresh.emit();
        }
    }
    onDelete() {
        this.notificationService.confirm(this.theDeleteCallback, this.deleteMessage);
    }
    onAccept() {
        this.accept.emit();
    }
    onRelease() {
        this.release.emit(null);
    }
    private saveAndCloseCallback() {        
        this.close.emit();
        setTimeout(() => {
            this.navigationService.navigateBack();
        }, 0);
    }
    private deleteCallback() {
        this.delete.emit(this.theCloseCallback);
    }
    private get lastNav() {
        let navPoints = this.navigationService.getNavigationPoints().value;
        if (navPoints.length > 2) {
            let result = navPoints[navPoints.length - 2];
            return result.displayText;
        }
        return "";
    }
}