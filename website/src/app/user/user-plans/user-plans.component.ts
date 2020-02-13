import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SideNavService } from './../side-nav.service';
import { UserService } from './../user.service';
import { UserPlan } from './user-plan.model';

@Component({
	selector: 'c-app-user-plans',
	templateUrl: './user-plans.component.html',
	styleUrls: ['./user-plans.component.scss'],
})
export class UserPlansComponent implements OnInit {
	userPlans: Observable<Array<UserPlan>>;

	constructor(private sideNavService: SideNavService, private userService: UserService) {
		this.userPlans = this.userService.getUserPlans();
	}

	ngOnInit() {}

	openDetails(page) {
		this.sideNavService.openNav(page);
	}
}
