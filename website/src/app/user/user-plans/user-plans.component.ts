import { UserService } from './../user.service';
import { SideNavService } from './../side-nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'c-app-user-plans',
	templateUrl: './user-plans.component.html',
	styleUrls: ['./user-plans.component.scss'],
})
export class UserPlansComponent implements OnInit {
	userPlans: Array<any> = [];
	constructor(public nav: SideNavService, public userService: UserService) {
		this.userService.getUserPlans().subscribe($userPlans => {
			this.userPlans = $userPlans;
		});
	}

	ngOnInit() {}

	openDetails(page) {
		this.nav.openNav(page);
	}
}
