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
		requestService.isLoading.subscribe(input => { this.isLoading = input.show; this.message = input.message });
	}
}
