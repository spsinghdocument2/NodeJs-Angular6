import { Component, Output, Input, EventEmitter, HostBinding, AfterViewInit } from '@angular/core';
import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';

@Component({
    selector: 'bh-r-checkbox',
    templateUrl: 'bh-r-checkbox.component.html'
})

export class CheckboxRComponent extends SimpleRComponentBase {
    //@Output() checked: EventEmitter<boolean> = new EventEmitter<boolean>();

    //onClick(value) {
    //    this.checked.emit(value);
    //}
    @Input() isIndeterminate: boolean = false;

    @HostBinding('class.inline-checkbox') isInline: boolean;

    ngAfterViewInit() {
        if (this.bhControl.data.inline === true) {
            this.isInline = true;
        }
    }

    removeIndeterminate() {
        this.isIndeterminate = false;
    }
}
