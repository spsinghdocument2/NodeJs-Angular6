import { Component, Input } from '@angular/core';
import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';
import { FormatPipe } from '../pipes/format.pipe';
import { AppFunctions } from '../app.functions';
//declare var moment: any;
import * as moment from 'moment'; // add this 1 of 4

@Component({
    selector: 'bh-r-date',
    templateUrl: 'bh-r-date.component.html'
})
export class DateRComponent extends SimpleRComponentBase {

    internalValue: string;
    @Input() dateOptions: boolean = false;

    onValueChanged(value) {
        this.internalValue = this.parseDisplayFn(this.control.value);
        super.onValueChanged(this.internalValue);
    }

    // override
    onChange(newValue: any) {
        let result = this.parseModelFn(newValue);

        this.control.patchValue(result);
        this.control.markAsDirty();
    }

    onBlur() {
        this.hasFocus = false;
        this.emitOnBlur.emit();
    }

    parseModelFn(value) {
        if (!value) {
            return null;
        }

        switch (this.bhControl.data.type) {
            case 'datetime':
                return AppFunctions.parseDateTime(value).toISOString();
            case 'time':
                return moment(value, 'hh:mm A').toISOString();
            case 'date':
            default:
                return AppFunctions.parseDate(value).toISOString();
        }
    }

    parseDisplayFn(value) {
        if (!value) {
            return null;
        }

        switch (this.bhControl.data.type) {
            case 'datetime':
                return AppFunctions.parseDateTime(value).format('MM/DD/YYYY hh:mm A');
            case 'time':
                return AppFunctions.parseDateTime(value).format('hh:mm A');
            case 'date':
            default:
                return AppFunctions.parseDate(value).format('MM/DD/YYYY');
        }
    }

}
