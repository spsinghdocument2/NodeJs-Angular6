import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';

import { AppFunctions } from '../../app.functions';
import { BhControl } from '../helpers/bh-control.class';


export abstract class SimpleRComponentBase implements OnInit, OnChanges {
    @Input() bhControl: BhControl;
    @Input() form: FormGroup;

    @Output('blur') emitOnBlur = new EventEmitter();
    control: AbstractControl;

    validationMessage: string = '';
    protected parsingValue: boolean = false;
    protected isRequired: boolean = false;
	protected hasFocus: boolean = false;


    get isValid() {
        return this.form.controls[this.bhControl.key].valid || this.form.controls[this.bhControl.key].pristine;
    }

    ngOnChanges(changes: any) {
        // Need to move toward only disabled
        this.bhControl.disabled = (this.bhControl.disabled || this.bhControl.readonly || (this.bhControl.data && this.bhControl.data.readonly)) || false;

		if (this.control) {
			if (this.bhControl.disabled || this.form.disabled) {
				this.control.disable();
			} else {
				this.control.enable();
			}
        }

        if (this.bhControl.validators) {
            let hasRequired = this.bhControl.validators.filter(validator => {
                return (validator == Validators.required);
            });

            if (hasRequired.length === 1) {
                this.isRequired = true;
            }

            // gdo: added this reduntant call for drop downs, I'm not sure why they don't get the required validator when the control
            //         is added like the other control components, but they don't
            let abstractControl = this.form.controls[this.bhControl.key];
            if (abstractControl) {
                abstractControl.setValidators(this.bhControl.validators);
            }
        }
    }

    ngOnInit(): void {
        if (!this.bhControl) {
            throw new TypeError('Your form is bound to a non-existant bhControl object, ex: [bhControl]="IDontExist" on a ' + this.constructor.toString().replace('function ', ''));
        }
        if (!this.form) {
            throw new TypeError('Your control is bound to a non-existant form object, ex: [form]="IDontExist" on a ' + this.constructor.toString().replace('function ', ''));
        }

        this.bhControl.data = this.bhControl.data || { value: '' };

        if (this.bhControl.data.value == null)
            this.bhControl.data.value = '';

        //this.bhControl.data.value = this.bhControl.data.value || '';

        try {
            this.form.addControl(this.bhControl.key, new FormControl(this.bhControl.data.value, this.bhControl.validators));
        } catch (ex) {
            // gdo : left this on purpose because the addControl will throw and error and this allows
            //         the developer to find the affending control faster
             // this only fires if the debugger is open
        }

        this.control = this.form.get(this.bhControl.key);
        this.ngOnChanges(null);

        this.control.valueChanges
            .subscribe(data => this.onValueChanged(data));

        this.onValueChanged();
        this.control.markAsPristine(); 
    }

    //ngOnChanges(changes: SimpleChanges) {
    //	console.log('ngOnChanges - myProp = ' + changes['bhControl'].currentValue);
    //}

    onBlur(newValue: any) {
        if (this.bhControl.parseFunction) {
            this.parsingValue = true;
            this.control.patchValue(this.bhControl.parseFunction(this.control.value));
            this.parsingValue = false;
        }

        this.hasFocus = false;
        this.emitOnBlur.emit();
	}

	private onFocus() {
		this.hasFocus = true;
	}

    onValueChanged(data?: any) {
        if (!this.form || this.parsingValue) { return; }

        this.setValidationMessage();
    }

    setValidationMessage() {
        let validationMessages = this.bhControl.validationMessages;

        this.validationMessage = '';

        if (this.control && !this.control.valid) {
            let messages = validationMessages || {};
            for (let key in this.control.errors) {
                var message = messages[key];
                // default messages
                if (!message) {
                    switch (key) {
                        case 'required':
                            message = this.bhControl.label + ' is required.';
                            break;
                        case 'emailValidator':
                            message = 'Must be a valid email.'
                            break;
                        default:
                            message = 'Error';
                    }
                }

                this.validationMessage += `<p><i class="fa fa-exclamation-triangle"></i>${message}</p>`;
            }
        }
    }
}