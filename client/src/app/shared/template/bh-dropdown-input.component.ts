import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'bh-dropdown-input',
    templateUrl: 'bh-dropdown-input.component.html'
})
export class DropDownInputComponent {
	@Input() disabled: boolean = false;
	@Input() label: string;
	@Input() options: any[];
	@Input() optionsValue: string;
	@Input() optionsText: string;

	@Input('bh-model') bhModel: any;
    @Input('bh-property') bhProperty: any;

    @Output() selectChanged = new EventEmitter();

    onChange(value) {
        this.selectChanged.emit(value);
    }
}
