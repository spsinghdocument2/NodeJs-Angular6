import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AppFunctions } from '../app.functions';
import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';

@Component({
    selector: 'bh-r-dropdown',
    templateUrl: 'bh-r-dropdown.component.html'
})
export class DropDownRComponent extends SimpleRComponentBase implements OnInit {

    getOptionProperty(option: any, property: string) {
        return AppFunctions.traverseModelForProperty(option, property);
    }
}