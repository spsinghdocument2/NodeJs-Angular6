import { Component, OnInit, Input, Renderer, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { BhControl } from '../controls/helpers/bh-control.class';
import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';

@Component({
    selector: 'bh-r-address',
    templateUrl: 'bh-r-address.component.html'
})

export class AddressRComponent implements OnInit, AfterViewInit {
    @Input() bhControl: BhControl;
    @Input() form: FormGroup;
    @Input() canUpdateCountyAndCountry: boolean = false;
    protected isRequired: boolean = false;
    isOpen: boolean = false;
    addressInvalid: boolean = false;
    validationMessage: string = '';

    private documentClickListener: any;
    private updatingPartial: boolean = false;
    private updatingFull: boolean = false;

    modelProperties: any = {
        line1: '',
        line2: '',
        line3: '',
        line4: '',
        line5: '',
        city: '',
        stateCode: '',
        postalCode: '',
        county: '',
        countryCode: '',
        fullAddress: ''
    };

    // this is just to make referring to the controls easier 
    controls: any = {
        line1: FormControl,
        line2: FormControl,
        line3: FormControl,
        line4: FormControl,
        line5: FormControl,
        city: FormControl,
        stateCode: FormControl,
        postalCode: FormControl,
        county: FormControl,
        countryCode: FormControl,
        fullAddress: FormControl
    };

    constructor(protected renderer: Renderer, protected elementRef: ElementRef) { }

    get isValid() {
        return this.controls.fullAddress.valid;
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

        this.controls.line1 = this.form.controls[this.modelProperties.line1];
        this.controls.line2 = this.form.controls[this.modelProperties.line2];
        this.controls.line3 = this.form.controls[this.modelProperties.line3];
        this.controls.line4 = this.form.controls[this.modelProperties.line4];
        this.controls.line5 = this.form.controls[this.modelProperties.line5];
        this.controls.city = this.form.controls[this.modelProperties.city];
        this.controls.stateCode = this.form.controls[this.modelProperties.stateCode];
        this.controls.postalCode = this.form.controls[this.modelProperties.postalCode];
        this.controls.county = this.form.controls[this.modelProperties.county];
        this.controls.countryCode = this.form.controls[this.modelProperties.countryCode];
        this.controls.fullAddress = this.form.controls[this.modelProperties.fullAddress];

        this.controls.fullAddress.setValidators(this.bhControl.validators);

        this.controls.fullAddress
            .valueChanges
            .subscribe(data => this.validateFullAddress());

        this.controls.line1
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.line2
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.line3
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.line4
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.line5
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.city
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.stateCode
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.postalCode
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.county
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());

        this.controls.countryCode
            .valueChanges
            .subscribe(data => this.onAddressPartsChanged());


        if (this.bhControl.validators) {
            let hasRequired = this.bhControl.validators.filter(validator => {
                return (validator == Validators.required);
            });

            if (hasRequired.length === 1) {
                this.isRequired = true;
            }
        }

        this.controls.fullAddress.markAsPristine(); 
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

    onBlurOfFullAddress(fullAddress) {

        if (!fullAddress || !fullAddress.trim()) {
            this.updatingPartial = true;
            this.controls.line1.setValue('');
            this.controls.line2.setValue('');
            this.controls.line3.setValue('');
            this.controls.line4.setValue('');
            this.controls.line5.setValue('');
            this.controls.city.setValue('');
            this.controls.stateCode.setValue('');
            this.controls.postalCode.setValue('');
            this.controls.county.setValue('');
            this.controls.countryCode.setValue('');
            this.updatingPartial = false;
            return;
        }

        let updateModel = {
            line1: '',
            line2: '',
            line3: '',
            line4: '',
            line5: '',
            city: '',
            stateCode: '',
            postalCode: '',
            county: '',
            countryCode: ''
        }

        // get the address lines
        let addressLines = this.controls.fullAddress.value.trim().split('\n');
        let postalCodeLineNumber = this.findPostalCodeLine(addressLines);

        // If we cannot find a postalcode line then everything goes into the address lines,
        // and only 5 lines will be captured.
        if (!postalCodeLineNumber) {
            if (postalCodeLineNumber == null) {
                let finalLine = addressLines.pop().split(' ');
                let index = 0;
                addressLines.forEach(x => {
                    if (index == addressLines.length)
                        return;
                    switch (index) {
                        case 0:
                            updateModel.line1 = x;
                            break;
                        case 1:
                            updateModel.line2 = x;
                            break;
                        case 2:
                            updateModel.line3 = x;
                            break;
                        case 3:
                            updateModel.line4 = x;
                            break;
                        case 4:
                            updateModel.line5 = x;
                            break;
                    }
                    index++;
                });
                let lastIndex = finalLine.length - 1
                updateModel.stateCode = finalLine[lastIndex].toUpperCase().replace(',', '');
                if (lastIndex > 0) { updateModel.city = finalLine[lastIndex - 1].replace(',', ''); }
                let curIndex = 0;
                lastIndex = lastIndex - 1;
                while (curIndex < lastIndex) {
                    updateModel.line1 += finalLine[curIndex] ? finalLine[curIndex].replace(',', '') : '';
                    if (curIndex + 1 != lastIndex)
                        updateModel.line1 += ' ';
                    curIndex++;
                }
            }
            else if (postalCodeLineNumber == 0) {
                let finalLine = addressLines.pop().split(' ');
                let index = 0;
                let lastIndex = finalLine.length - 1
                updateModel.postalCode = finalLine[lastIndex];
                if (lastIndex > 0) { updateModel.stateCode = finalLine[lastIndex - 1].toUpperCase().replace(',', ''); }
                if (lastIndex > 1) { updateModel.city = finalLine[lastIndex - 2].replace(',', ''); }
                let curIndex = 0;
                lastIndex = lastIndex - 2;
                while (curIndex < lastIndex) {
                    updateModel.line1 += finalLine[curIndex] ? finalLine[curIndex].replace(',', '') : '';
                    if (curIndex + 1 != lastIndex)
                        updateModel.line1 += ' ';
                    curIndex++;
                }
            }
        }
        // If we found a postal code line and it is the last line, the parsing
        // will put the prior lines in the address line fields.
        else if (postalCodeLineNumber === (addressLines.length - 1)) {
            let finalLine = addressLines.pop().split(' ');
            let index = 0;
            addressLines.forEach(x => {
                if (index == addressLines.length)
                    return;
                switch (index) {
                    case 0:
                        updateModel.line1 = x;
                        break;
                    case 1:
                        updateModel.line2 = x;
                        break;
                    case 2:
                        updateModel.line3 = x;
                        break;
                    case 3:
                        updateModel.line4 = x;
                        break;
                    case 4:
                        updateModel.line5 = x;
                        break;
                }
                index++;
            });
            let lastIndex = finalLine.length - 1
            updateModel.postalCode = finalLine[lastIndex];
            if (lastIndex > 0) {
                if (finalLine[lastIndex - 1] != '') {
                    updateModel.stateCode = finalLine[lastIndex - 1].toUpperCase();
                }
                else {
                    updateModel.stateCode = finalLine[lastIndex - 2].toUpperCase();
                }
            }
            let curIndex = 0;
            if (finalLine[lastIndex - 1] != '') {
                lastIndex = lastIndex - 1;
            }
            else {
                lastIndex = lastIndex - 2;
            }
            while (curIndex < lastIndex) {
                updateModel.city += finalLine[curIndex] ? finalLine[curIndex].replace(',', '') : '';
                if (curIndex + 1 != lastIndex)
                    updateModel.city += ' ';

                curIndex++;
            }
        }
        // found a valid postal code and there was one more line after the postal code line
        else if (postalCodeLineNumber === (addressLines.length - 2)) {
            let countyCountry = addressLines.pop().split(' ');
            let postalCodeLine = addressLines.pop().split(' ');

            let countCountryLastIndex = countyCountry.length - 1;
            let postalCodeLineLastIndex = postalCodeLine.length - 1;

            let index = 0;
            addressLines.forEach(x => {
                if (index == addressLines.length)
                    return;
                switch (index) {
                    case 0:
                        updateModel.line1 = x;
                        break;
                    case 1:
                        updateModel.line2 = x;
                        break;
                    case 2:
                        updateModel.line3 = x;
                        break;
                    case 3:
                        updateModel.line4 = x;
                        break;
                    case 4:
                        updateModel.line5 = x;
                        break;
                }
                index++;
            });

            if (this.canUpdateCountyAndCountry) {

                // if there is only index in the county country the data will be
                // placed in the county field
                if (countCountryLastIndex === 0) {
                    updateModel.county = countyCountry[countCountryLastIndex];
                }
                else {
                    updateModel.countryCode = countyCountry[countCountryLastIndex];
                    let curcountyCountryIndex = 0;
                    countCountryLastIndex = countCountryLastIndex;

                    while (curcountyCountryIndex < countCountryLastIndex) {
                        updateModel.county += countyCountry[curcountyCountryIndex] ? countyCountry[curcountyCountryIndex].replace(',', '') : '';
                        if (curcountyCountryIndex + 1 != countCountryLastIndex)
                            updateModel.county += ' ';

                        curcountyCountryIndex++;
                    }
                }
            }
            else {
                updateModel.county = '';
                updateModel.countryCode = '';
            }

            updateModel.postalCode = postalCodeLine[postalCodeLineLastIndex];
            updateModel.stateCode = postalCodeLine[postalCodeLineLastIndex - 1].toUpperCase();
            let curPostalCodeIndex = 0;
            postalCodeLineLastIndex = postalCodeLineLastIndex - 1;

            while (curPostalCodeIndex < postalCodeLineLastIndex) {
                updateModel.city += postalCodeLine[curPostalCodeIndex] ? postalCodeLine[curPostalCodeIndex].replace(',', '') : '';
                if (curPostalCodeIndex + 1 != postalCodeLineLastIndex)
                    updateModel.city += ' ';

                curPostalCodeIndex++;
            }
        }
        // there were more lines than expected after the postal code line so all data is going into the line fields
        // since it didn't follow the format parsing will not be guessed at.
        else {
            let index = 0;
            addressLines.forEach(x => {
                if (index == addressLines.length)
                    return;
                switch (index) {
                    case 0:
                        updateModel.line1 = x;
                        break;
                    case 1:
                        updateModel.line2 = x;
                        break;
                    case 2:
                        updateModel.line3 = x;
                        break;
                    case 3:
                        updateModel.line4 = x;
                        break;
                    case 4:
                        updateModel.line5 = x;
                        break;
                }
                index++;
            });
        }

        this.updatingPartial = true;
        this.controls.line1.setValue(updateModel.line1);
        this.controls.line2.setValue(updateModel.line2);
        this.controls.line3.setValue(updateModel.line3);
        this.controls.line4.setValue(updateModel.line4);
        this.controls.line5.setValue(updateModel.line5);
        this.controls.city.setValue(updateModel.city);
        this.controls.stateCode.setValue(updateModel.stateCode);
        this.controls.postalCode.setValue(updateModel.postalCode);
        this.controls.county.setValue(updateModel.county);
        this.controls.countryCode.setValue(updateModel.countryCode);
        this.updatingPartial = false;

        this.setFullAddress();

        this.validateFullAddress();
    }

    findPostalCodeLine(addressLines: string[]): number {
        let lineIndex = 0;
        for (var addressline in addressLines) {
            let addressLineParts = addressLines[addressline].split(' ');
            let lastIndex = addressLineParts.length - 1
            if (this.ValidateZipCode(addressLineParts[lastIndex])) {
                return lineIndex;
            }
            lineIndex++;
        }

        return null;
    }

    onAddressPartsChanged() {
        if (this.updatingPartial) {
            return;
        }

        this.setFullAddress();

        this.validateFullAddress();
    }

    private validateFullAddress() {
        let validationMessages = this.bhControl.validationMessages;

        let fullAddressControl = this.controls.fullAddress;

        this.validationMessage = '';

        if (
            this.controls.line1.invalid ||
            this.controls.line2.invalid ||
            this.controls.line3.invalid ||
            this.controls.line4.invalid ||
            this.controls.line5.invalid ||
            this.controls.city.invalid ||
            this.controls.stateCode.invalid ||
            this.controls.postalCode.invalid ||
            this.controls.county.invalid ||
            this.controls.countryCode.invalid) {

            this.addressInvalid = true;
            this.validationMessage += `<p><i class="fa fa-exclamation-triangle"></i>Exceeded max length on one of the address lines.</p>`;
        } else {
            this.addressInvalid = false;
        }

        if (fullAddressControl && fullAddressControl.dirty && !fullAddressControl.valid) {
            let messages = validationMessages || {};
            for (let key in fullAddressControl.errors) {
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

    ValidateZipCode(zipCode: string): boolean {
        let result = false;

        if (zipCode.match(/^\d{5}(?:[-\s]\d{4})?$/g)) {
            result = true;
        }

        return result;
    }

    setFullAddress() {
        let address: string = '';

        // Format each line of the address
        if (this.controls.line1 && this.controls.line1.value && this.controls.line1.value.length > 0)
            address += this.controls.line1.value;
        if (this.controls.line2 && this.controls.line2.value && this.controls.line2.value.length > 0)
            address += '\n' + this.controls.line2.value;
        if (this.controls.line3 && this.controls.line3.value && this.controls.line3.value.length > 0)
            address += '\n' + this.controls.line3.value;
        if (this.controls.line4 && this.controls.line4.value && this.controls.line4.value.length > 0)
            address += '\n' + this.controls.line4.value;
        if (this.controls.line5 && this.controls.line5.value && this.controls.line5.value.length > 0)
            address += '\n' + this.controls.line5.value;

        // Format the city state and postal code line.
        if (this.controls.city && this.controls.city.value && this.controls.city.value.length > 0) {
            address += `\n${this.controls.city.value}`;
        }
        if (this.controls.stateCode && this.controls.stateCode.value && this.controls.stateCode.value.length > 0) {
            address += `, ${this.controls.stateCode.value}`;
        }
        if (this.controls.postalCode && this.controls.postalCode.value && this.controls.postalCode.value.length > 0) {
            address += ` ${this.controls.postalCode.value}`;
        }

        if (this.controls.county && this.controls.county.value && this.controls.county.value.length > 0) {
            address += `\n${this.controls.county.value}`;
        }
        if (this.controls.countryCode && this.controls.countryCode.value && this.controls.countryCode.value.length > 0) {
            address += `, ${this.controls.countryCode.value}`;
        }

        let wholeAddress = address.trim();

        this.controls.fullAddress.setValue(wholeAddress);
    }

    public States: any[] = [
        { Label: "ALABAMA", Id: "AL" },
        { Label: "ALASKA", Id: "AK" },
        { Label: "AMERICAN SAMOA", Id: "AS" },
        { Label: "ARIZONA", Id: "AZ" },
        { Label: "ARKANSAS", Id: "AR" },
        { Label: "CALIFORNIA", Id: "CA" },
        { Label: "COLORADO", Id: "CO" },
        { Label: "CONNECTICUT", Id: "CT" },
        { Label: "DELAWARE", Id: "DE" },
        { Label: "DISTRICT OF COLUMBIA", Id: "DC" },
        { Label: "FEDERATED STATES OF MICRONESIA", Id: "FM" },
        { Label: "FLORIDA", Id: "FL" },
        { Label: "GEORGIA", Id: "GA" },
        { Label: "GUAM", Id: "GU" },
        { Label: "HAWAII", Id: "HI" },
        { Label: "IDAHO", Id: "ID" },
        { Label: "ILLINOIS", Id: "IL" },
        { Label: "INDIANA", Id: "IN" },
        { Label: "IOWA", Id: "IA" },
        { Label: "KANSAS", Id: "KS" },
        { Label: "KENTUCKY", Id: "KY" },
        { Label: "LOUISIANA", Id: "LA" },
        { Label: "MAINE", Id: "ME" },
        { Label: "MARSHALL ISLANDS", Id: "MH" },
        { Label: "MARYLAND", Id: "MD" },
        { Label: "MASSACHUSETTS", Id: "MA" },
        { Label: "MICHIGAN", Id: "MI" },
        { Label: "MINNESOTA", Id: "MN" },
        { Label: "MISSISSIPPI", Id: "MS" },
        { Label: "MISSOURI", Id: "MO" },
        { Label: "MONTANA", Id: "MT" },
        { Label: "NEBRASKA", Id: "NE" },
        { Label: "NEVADA", Id: "NV" },
        { Label: "NEW HAMPSHIRE", Id: "NH" },
        { Label: "NEW JERSEY", Id: "NJ" },
        { Label: "NEW MEXICO", Id: "NM" },
        { Label: "NEW YORK", Id: "NY" },
        { Label: "NORTH CAROLINA", Id: "NC" },
        { Label: "NORTH DAKOTA", Id: "ND" },
        { Label: "NORTHERN MARIANA ISLANDS", Id: "MP" },
        { Label: "OHIO", Id: "OH" },
        { Label: "OKLAHOMA", Id: "OK" },
        { Label: "OREGON", Id: "OR" },
        { Label: "PALAU", Id: "PW" },
        { Label: "PENNSYLVANIA", Id: "PA" },
        { Label: "PUERTO RICO", Id: "PR" },
        { Label: "RHODE ISLAND", Id: "RI" },
        { Label: "SOUTH CAROLINA", Id: "SC" },
        { Label: "SOUTH DAKOTA", Id: "SD" },
        { Label: "TENNESSEE", Id: "TN" },
        { Label: "TEXAS", Id: "TX" },
        { Label: "UTAH", Id: "UT" },
        { Label: "VERMONT", Id: "VT" },
        { Label: "VIRGIN ISLANDS", Id: "VI" },
        { Label: "VIRGINIA", Id: "VA" },
        { Label: "WASHINGTON", Id: "WA" },
        { Label: "WEST VIRGINIA", Id: "WV" },
        { Label: "WISCONSIN", Id: "WI" },
        { Label: "WYOMING", Id: "WY" }
    ];
}

//export interface IState {
//    Label: string;
//    Id: string;
//}