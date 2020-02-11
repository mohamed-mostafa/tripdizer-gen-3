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

	constructor(public nav: SideNavService) {
		this.subscriptions.add(
			this.nav.navContent.subscribe($navContent => {
				this.bookingDetails = $navContent.data;
				console.log(this.bookingDetails);
			})
		);
	}

	closeNav() {
		this.nav.closeNav();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
