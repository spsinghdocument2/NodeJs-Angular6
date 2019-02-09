import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';
import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';
import { FormGroup } from '@angular/forms';
import { BhControl } from '../controls/helpers/bh-control.class';

@Component({
    selector: 'bh-r-input',
    templateUrl: 'bh-r-input.component.html'
   
})

export class InputRComponent extends SimpleRComponentBase implements AfterViewInit {
    @ViewChild('inp') input;

    // adding @ViewChild caused the inputs in the base class to be undefined.
    // redefine them here.
    @Input() bhControl: BhControl;
    @Input() form: FormGroup;
    @Input() hasButton: boolean = false;

    ngAfterViewInit(): void { 
        if (this.bhControl.data != null && this.bhControl.data.autofocus != null && this.bhControl.data.autofocus) {
            let elementArray = document.querySelectorAll(`#${this.bhControl.key}`);

            if (elementArray.length > 0) {
                (<HTMLScriptElement>elementArray[0]).focus();
            }
        }
    }

    public focus(): void {
        this.input.nativeElement.focus();
    }    
}

