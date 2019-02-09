import { Component, Input } from '@angular/core';

@Component({
	selector: 'bh-r-loading',
	template: `
	<div class="loading-indicator-details-container">
		<div class="loading-indicator-details" *ngIf="isLoading"></div>
		<i *ngIf="isLoading" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
		<ng-content></ng-content>
	</div>
	`
})
export class LoadingRComponent {
	@Input() isLoading: boolean = false;
}