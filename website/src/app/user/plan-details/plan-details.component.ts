import { SideNavService } from './../side-nav.service';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-app-plan-details',
	templateUrl: './plan-details.component.html',
	styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnDestroy {
	private subscriptions = new Subscription();
	bookingDetails: any;

	constructor(private sideNavService: SideNavService) {
		this.bookingDetails = this.sideNavService.navContent;
	}

	closeNav() {
		this.sideNavService.closeNav();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
