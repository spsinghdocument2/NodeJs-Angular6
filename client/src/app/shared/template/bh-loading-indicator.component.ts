import { Component } from '@angular/core';

@Component({
	selector: 'bh-loading-indicator',
	template: `
	<div class="loading-indicator">
		<span><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></span>
	</div>
	`
})

export class LoadingIndicator { }