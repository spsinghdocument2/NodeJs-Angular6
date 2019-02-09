import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'bh-r-modal',
    templateUrl: 'bh-r-modal.component.html'
})
export class ModalRComponent implements OnInit {
    @Input() modalTitle: string = '';
    @Input() modalHeight: string = '';
    @Input() closeBtnTitle: string = 'Close';
    @Input() showFooter: boolean = true;
	@Input() size: string = '';
    @Input() isMultiSelect: boolean = false;
    @Input() onCloseHandler: Function = () => { };
    @Input() isLoading: boolean = false;
	@Output() close: EventEmitter<Function> = new EventEmitter<Function>();

    isOpen: boolean = false;

	// extra steps to scope correctly, otherwise the callback won't have a 'this'
	public theCloseCallback: Function;

    ngOnInit() {       
		this.theCloseCallback = this.hide.bind(this);
    }

    toggleOpen($event: MouseEvent) {
        this.isOpen = !this.isOpen;
        event.preventDefault();
        event.stopPropagation();
    }

    show() {
        this.isOpen = true;
    }

    hide(forceClose?: boolean) {
        if (!this.isMultiSelect || forceClose) {
            this.isOpen = false;
        }
    }
}