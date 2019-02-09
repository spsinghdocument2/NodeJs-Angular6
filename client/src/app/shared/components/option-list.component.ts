import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, ViewChild } from '@angular/core';
import { OptionGroup, OptionItem } from '../models/OptionGroup';
@Component({
    templateUrl: 'option-list.component.html',
    selector: 'bh-options-list' 
})
export class OptionListComponent implements OnInit {
    @Input() header: string = "*";
    @Input() colheight: string = "65vh";
    @Input() OptionGroups: OptionGroup[] = [];
    @Output() selectedID: EventEmitter<string> = new EventEmitter<string>();
    @Output() selectionChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    useOptionGroupName() {
        return true;
    }

    private optionSelected(value: HTMLElement) {
        if (!value) {
            return;
        }
        this.selectedID.emit(value.id);
    }

    private AllSelected() {
        return this.OptionGroups.every(g => g.AllSelected());
    }

    private NoneSelected() {
        return this.OptionGroups.every(g => g.NoneSelected());
    }

    private selectAll() {
        this.OptionGroups.forEach(g => g.Select(true));
        this.selectedID.emit("");
    }

    private unSelectAll() {
        this.OptionGroups.forEach(g => g.Select(false));
        this.selectedID.emit("");
  }

    private availableHeader() {
        return "Available " + this.header;
    }

    private selectedHeader() {
        return "Selected " + this.header;
    }
}