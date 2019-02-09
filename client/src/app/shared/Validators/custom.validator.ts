import { FormControl, AbstractControl, ValidatorFn, Validators } from '@angular/forms';

import { AppFunctions } from '../app.functions';

//var moment = require('moment');
declare var moment: any;
export class CustomValidators {
    static emailValidator(control: FormControl) {

        return AppFunctions.regularExpressionMatched(control.value, 'email') ? null : {
            emailValidator: {
                valid: false
            }
        };

    }

    static phoneValidator(control: FormControl) {

        return AppFunctions.regularExpressionMatched(control.value, 'phone') ? null : {
            phoneValidator: {
                valid: false
            }
        };

    }

    static urlValidator(control: FormControl) {

        return AppFunctions.regularExpressionMatched(control.value, 'url') ? null : {
            urlValidator: {
                valid: false
            }
        };

    }

    static regExValidator(regExValidator: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            // check to see if the this control has a required validator on it
            //if (Validators.required(control)) return null;

            var v: string = control.value;

            //let REGEXP = new RegExp(regExValidator);
            
            return !(regExValidator.test(v)) ?
                {
                    regExValidator: {
                        valid: false
                    }
                } : null;

            // cool patern, keeping it in comments for reference for later, gdo 9/9/2016
            //return v.length < minLength ?
            //	{ 'minlength': { 'requiredLength': minLength, 'actualLength': v.length } } :
            //	null;
        };
    }

    static rangeValidator(lower: number, upper: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let v: number = control.value;
            if (typeof v == 'string') { // Currency Type BhControl
                v = AppFunctions.validNumber(v);
            }
            return ((lower != null && v < lower) || (upper != null && v > upper)) ?
                { rangeValidator: { valid: false } }
                : null;
        };
    }

    static minValueValidator(lower: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let v: number = control.value;
            if (typeof v == 'string') {
                v = AppFunctions.validNumber(v);
            }
            return ((lower != null && v < lower)) ?
                { minValueValidator: { valid: false } }
                : null;
        };
    }

    static maxValueValidator(upper: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let v: number = control.value;
            if (typeof v == 'string') { 
                v = AppFunctions.validNumber(v);
            }
            return ( (upper != null && v > upper)) ?
                { maxValueValidator: { valid: false } }
                : null;
        };
    }

    static dateValidator(control: FormControl) {
        let isValid = control.value ? moment(control.value, "M/D/YYYY", true).isValid() : true;
        return isValid ? null : {
            dateValidator: {
                valid: false
            }
        };
    }

    static hasDigitValidator(control: FormControl) {
        if (control.value !== null) {
            return /\d+/.test(control.value) ? null : {
                hasDigitValidator: {
                    valid: false
                }
            };
        }
        return null
    }

    static hasSymbolValidator(control: FormControl) {
        if (control.value !== null) {
            return /\W+/.test(control.value) ? null : {
                hasSymbolValidator: {
                    valid: false
                }
            };
        }
        return null;
    }

    static mixedCaseValidator(control: FormControl) {
        if (control.value !== null) {
            return control.value != control.value.toLowerCase() && control.value != control.value.toUpperCase() ? null : {
                mixedCaseValidator: {
                    valid: false
                }
            };
        }
        return null;
    }

    static failValidator(control: FormControl) {
        if (control) {
            return {
                failValidator: {
                    valid: false
                }
            };
        }
    }

    static equalToValidator(equalControl: AbstractControl): ValidatorFn {
        //let subscribe: boolean = false;
        return (control: AbstractControl): { [key: string]: any } => {
            //if (!subscribe) {
            //    subscribe = true;
            //    equalControl.valueChanges.subscribe(() => {
            //        control.updateValueAndValidity();
            //    });
            //}

            return equalControl.value === control.value ? null : { equalToValidator: true };
        };
    }

    static dateComparisonValidator(compareWith: AbstractControl, comparisonType: string): ValidatorFn {
        let isValid: boolean = false;
        return (control: AbstractControl): { [key: string]: any } => {
            switch (comparisonType) {
                case 'isAfter':
                    isValid = moment(control.value).isAfter(moment(compareWith.value));
                    break;
                case 'isSameOrAfter':
                    isValid = moment(control.value).isSameOrAfter(moment(compareWith.value));
                    break;
                case 'isBefore':
                    isValid = moment(control.value).isBefore(moment(compareWith.value));
                    break;
                case 'isSameOrBefore':
                    isValid = moment(control.value).isSameOrBefore(moment(compareWith.value));
                    break;
                default:
                    break;
            }
            return isValid ? null : { dateComparisonValidator: true };
        };
    }
}