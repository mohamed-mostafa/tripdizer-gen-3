import { UserPlan } from './../user-models/user-plan.model';
import { SideNavService } from './../side-nav.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'c-app-plan-details',
	templateUrl: './plan-details.component.html',
	styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent {
	bookingDetails: Observable<UserPlan[]>;

	constructor(private sideNavService: SideNavService) {
		this.bookingDetails = this.sideNavService.navContent;
	}

	closeNav() {
		this.sideNavService.closeNav();
	}
}
