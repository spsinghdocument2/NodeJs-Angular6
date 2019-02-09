import { Component, Input } from '@angular/core';

@Component({
	selector: 'bh-tab',
    templateUrl: 'bh-tab.component.html'
})

export class TabComponent {
    @Input('tabTitle') title: string;
    @Input() tabError: boolean = false;
    @Input() tabPrimary: boolean = false;
    @Input() active = false;
    @Input() disable: boolean = false;
    @Input('tabColor') tabColor: 'tab-pane';
    @Input('hiddenValue') selectedValue: string;
}