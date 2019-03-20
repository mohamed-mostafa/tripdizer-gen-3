import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RequestService } from './request.service';

@Component({
	selector: 'c-request',
	templateUrl: './request.component.html',
	styleUrls: ['./request.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class RequestComponent implements OnDestroy {
	constructor(private requestService: RequestService) {}

	ngOnDestroy() {
		this.requestService.resetRequestState();
	}
}
