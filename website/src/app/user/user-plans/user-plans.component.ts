import { UserService } from './../user.service';
import { SideNavService } from './../side-nav.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'c-app-user-plans',
	templateUrl: './user-plans.component.html',
	styleUrls: ['./user-plans.component.scss'],
})
export class UserPlansComponent implements OnInit {
	userPlans: Observable<Array<any>>;
	constructor(private sideNavService: SideNavService, public userService: UserService) {
		this.userPlans = this.userService.getUserPlans();
	}

	ngOnInit() {}

	openDetails(page) {
		this.sideNavService.openNav(page);
	}
}
