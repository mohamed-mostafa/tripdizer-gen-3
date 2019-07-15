import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from './request.service';

@Component({
	selector: 'c-request',
	templateUrl: './request.component.html',
	styleUrls: ['./request.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class RequestComponent implements OnDestroy {
	constructor(private requestService: RequestService, private activatedRoute: ActivatedRoute) {
		this.activatedRoute.queryParams.subscribe(params =>
			this.requestService.setProperty('countries', params['countries'])
		);
	}

	ngOnDestroy() {
		this.requestService.resetRequestState();
	}
}
