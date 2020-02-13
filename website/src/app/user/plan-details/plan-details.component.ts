import { SideNavService } from './../side-nav.service';
import { Component } from '@angular/core';

@Component({
	selector: 'c-app-plan-details',
	templateUrl: './plan-details.component.html',
	styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent {
	bookingDetails: any;

	constructor(private sideNavService: SideNavService) {
		this.bookingDetails = this.sideNavService.navContent;
	}

	closeNav() {
		this.sideNavService.closeNav();
	}
}
