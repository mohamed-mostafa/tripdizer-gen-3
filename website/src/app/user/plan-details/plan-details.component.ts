import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPlan } from '../user-plans/user-plan.model';
import { SideNavService } from './../side-nav.service';

@Component({
	selector: 'c-app-plan-details',
	templateUrl: './plan-details.component.html',
	styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent {
	planDetails: Observable<UserPlan[]>;

	constructor(private sideNavService: SideNavService) {
		this.planDetails = this.sideNavService.navContent;
	}

	closeNav() {
		this.sideNavService.closeNav();
	}
}
