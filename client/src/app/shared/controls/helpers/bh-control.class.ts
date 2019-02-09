import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

export class BhControl {
    key: string;
    label: string;
    data?: any;
    validators?: ValidatorFn[];
    validationMessages?: any;
    parseFunction?: Function;
    disabled?: boolean = false;
    readonly?: boolean = false;
    isAllListOptionSelected?: boolean = false;
}