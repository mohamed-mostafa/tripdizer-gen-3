import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SideNavService } from '../../side-nav.service';
import { UserPlan } from '../user-plan.model';

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
