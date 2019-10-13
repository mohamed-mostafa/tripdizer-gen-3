import { Component } from '@angular/core';

/* Services */
import { RequestService } from '../request.service';

@Component({
	selector: 'c-request-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss'],
})
export class RequestLoadingComponent {
	isLoading;
	message: string;
	constructor(requestService: RequestService) {
		requestService.isLoading.subscribe(input => {
			if (!this.isLoading) {
				// Only set the new message if the loading is not already displayed, otherwise don't change the message
				this.message = input.message;
			}
			this.isLoading = input.show;
		});
	}
}
