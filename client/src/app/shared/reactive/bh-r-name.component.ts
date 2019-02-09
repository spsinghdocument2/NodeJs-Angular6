import { Component, OnInit, Input, Renderer, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { BhControl } from '../controls/helpers/bh-control.class';
import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';

@Component({
	selector: 'bh-r-name',
    templateUrl: 'bh-r-name.component.html'
})

export class NameRComponent implements OnInit, AfterViewInit {
	@Input() bhControl: BhControl;
	@Input() form: FormGroup;

	isOpen: boolean = false;
	validationMessage: string = '';
	protected isRequired: boolean = false;

	private documentClickListener: any;
	private updatingPartial: boolean = false;
    private updatingFull: boolean = false;
    private tempPrefix: string = '';
    private tempSufix: string = '';

	private prefixes: string[] = ["", "Dr.", "Madam", "Miss", "Mr.", "Mrs.", "Ms.", "Prof.", "Rev.", "Sir"];
	private suffixes: string[] = ["", "Jr", "Sr", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "Atty", "CPA", "DDS", "Esq", "MD", "PhD"];
	private lastNamePreposition: string[] = ["Aet", "Atte", "Apud", "D", "De", "Del", "Des", "Di", "Du", "In", "La", "Le", "Mac", "Mc", "O", "On", "St", "Van", "Von"];

	modelProperties: any = {
		title: '',
		fullName: '',
		firstName: '',
		middleName: '',
		lastName: '',
		suffix: ''
	};

	// this is just to make referring to the controls easier 
	controls: any = {
		title: FormControl,
		fullName: FormControl,
		firstName: FormControl,
		middleName: FormControl,
		lastName: FormControl,
		suffix: FormControl
	};

	constructor(protected renderer: Renderer, protected elementRef: ElementRef) { }

	get isValid() {
		return (
			this.controls.fullName.valid &&
			this.controls.title.valid &&
			this.controls.firstName.valid &&
			this.controls.middleName.valid &&
			this.controls.lastName.valid &&
            this.controls.suffix.valid
		);
	}

	ngOnInit() {
		var property; // can't be of type BhControl because of how it's used below
		let propertyNames = this.bhControl.data.propertyNames;
		let model = this.bhControl.data.model;

		this.modelProperties = propertyNames;

		for (property in propertyNames) {
			let modelProperty = propertyNames[property];
			this.form.addControl(propertyNames[property], new FormControl(model[modelProperty]));
		}

		if (this.bhControl.validators) {
			let hasRequired = this.bhControl.validators.filter(validator => {
				return (validator == Validators.required);
			});

			if (hasRequired.length === 1) {
				this.isRequired = true;
			}
		}

		this.controls.title = this.form.controls[this.modelProperties.title];
		this.controls.fullName = this.form.controls[this.modelProperties.fullName];
		this.controls.firstName = this.form.controls[this.modelProperties.firstName];
		this.controls.middleName = this.form.controls[this.modelProperties.middleName];
		this.controls.lastName = this.form.controls[this.modelProperties.lastName];
		this.controls.suffix = this.form.controls[this.modelProperties.suffix];

		this.controls.fullName.setValidators(this.bhControl.validators);

		this.controls.fullName
			.valueChanges
            .subscribe(data => this.validateFullName());

        this.controls.fullName.markAsPristine(); 
	}

	toggleOpen($event: MouseEvent) {
		if (this.bhControl.data.readonly) {
			return;
		}
		this.isOpen = !this.isOpen;
		event.preventDefault();
		event.stopPropagation();
	}

	show() {
		this.isOpen = true;
	}

	hide() {
		this.isOpen = false;
	}

	onFullNameChanged(fullName) {
		if (this.updatingFull) {
			return;
		}

        if (!fullName || !fullName.trim()) {
            this.updatingPartial = true;
			this.controls.title.setValue('');
			this.controls.firstName.setValue('');
			this.controls.middleName.setValue('');
			this.controls.lastName.setValue('');
            this.controls.suffix.setValue('');
            this.updatingPartial = false;
            return;
		}

		let updateModel = {
			title: '',
			firstName: '',
			middleName: '',
			lastName: '',
			suffix: ''
		}

		let nameSplitOnSpace = fullName.split(' ');
		nameSplitOnSpace = nameSplitOnSpace.filter(value => {
			return (value); // not blank
		});

		// Title or Prefix
		let foundTitle = this.prefixes.filter(arrayElement => {
			return (arrayElement.toLowerCase() == nameSplitOnSpace[0].toLowerCase()); 
		});

		if (foundTitle.length === 1) {
			updateModel.title = foundTitle[0];
			nameSplitOnSpace.splice(0, 1);
        }
        let lastElementIndex;
        let foundSuffix;
        if (nameSplitOnSpace.length > 0)
         {
            lastElementIndex = nameSplitOnSpace.length - 1;
            // Suffix
            foundSuffix  = this.suffixes.filter(arrayElement => {
                return (arrayElement.toLowerCase() == nameSplitOnSpace[lastElementIndex].toLowerCase());
            });
                if (foundSuffix.length === 1) {
                    updateModel.suffix = foundSuffix[0];
                    nameSplitOnSpace.splice(lastElementIndex, 1);
                }

         
        }

		
		let foundlastNamePreposition;

		if (nameSplitOnSpace.length > 0) {
			updateModel.firstName = nameSplitOnSpace[0];
			nameSplitOnSpace.splice(0, 1);

			if (nameSplitOnSpace.length > 0) {
				if (nameSplitOnSpace.length === 1) {
					updateModel.lastName = nameSplitOnSpace[0];
				} else {
					let lastElementIndex = nameSplitOnSpace.length - 1;

					// last element is last name
					let lastName = nameSplitOnSpace[lastElementIndex];
					// remove it from the array
					nameSplitOnSpace.splice(lastElementIndex, 1);
					lastElementIndex--;

					foundlastNamePreposition = this.lastNamePreposition.filter(arrayElement => {
						return (arrayElement.toLowerCase() == nameSplitOnSpace[lastElementIndex].toLowerCase());
					});

					if (foundlastNamePreposition.length === 1) {
						lastName = foundlastNamePreposition + ' ' + lastName;
						// remove it from the array
						nameSplitOnSpace.splice(lastElementIndex, 1);
					}

					updateModel.lastName = lastName;

					// the middle name is all the rest
					updateModel.middleName = nameSplitOnSpace.join(' ');
				}
			}
		}

		this.updatingPartial = true;
		this.controls.title.setValue(updateModel.title);
		this.controls.firstName.setValue(updateModel.firstName);
		this.controls.middleName.setValue(updateModel.middleName);
		this.controls.lastName.setValue(updateModel.lastName);
		this.controls.suffix.setValue(updateModel.suffix);
		this.updatingPartial = false;

		this.validateFullName();
	}

    OnChangePrefix(updatedValues) {

        this.tempPrefix = updatedValues;
        this.onNamePartsChanged();
    }
    OnChangeSufix(updatedValues) {

        this.tempSufix = updatedValues;
        this.onNamePartsChanged();
    }
    onNamePartsChanged() {
        if (this.updatingPartial) {
			return;
		}

        let wholeName = this.combineStrings(
            this.tempPrefix,
            this.controls.firstName.value,
            this.controls.middleName.value,
            this.controls.lastName.value,
            this.tempSufix
        );

  //     `${this.controls.title.value || ''} ${this.controls.firstName.value} ${this.controls.middleName.value} ${this.controls.lastName.value} ${this.controls.suffix.value || ''}`;
		//wholeName = wholeName.trim();

        this.updatingFull = true;
		this.controls.fullName.setValue(wholeName);
		this.updatingFull = false;
		this.validateFullName();
    }

    private combineStrings(...args: string[]) {
        // remove empty
        args = args.filter(arg => (arg && arg.trim() !== ''));
        return args
            .map(arg => arg.trim())
            .join(' ');
    }

	private validateFullName() {
		let validationMessages = this.bhControl.validationMessages;

		let fullNameControl = this.controls.fullName;

		this.validationMessage = '';


		if (fullNameControl && fullNameControl.dirty && !fullNameControl.valid) {
			let messages = validationMessages || {};
			for (let key in fullNameControl.errors) {
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

	ngAfterViewInit() {
		this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
			if (!this.elementRef.nativeElement.contains(event.target)) {
				this.isOpen = false;
			}
		});
	}

	blurLastElement(event) {
		if (!this.elementRef.nativeElement.contains(event.relatedTarget)) {
			this.isOpen = false;
		}
	}
}