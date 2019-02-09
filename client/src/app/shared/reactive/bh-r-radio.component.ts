import { Component, Input } from '@angular/core';

import { AppFunctions } from '../app.functions';
import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';

@Component({
	selector: 'bh-r-radio',
    templateUrl: 'bh-r-radio.component.html'
})

export class RadioRComponent extends SimpleRComponentBase {
    @Input() noMargin: boolean = false;

    getOptionProperty(option: any, property: string) {
        return AppFunctions.traverseModelForProperty(option, property);
    }
}