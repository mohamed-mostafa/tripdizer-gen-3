import { UserService } from './../user.service';
import { SideNavService } from './../side-nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'c-app-booking-plans',
	templateUrl: './user-booking.component.html',
	styleUrls: ['./user-booking.component.scss'],
})
export class UserBookingComponent implements OnInit {
	userBookings: Array<any> = [];
	constructor(public nav: SideNavService, public userService: UserService) {
		this.userService.getUserBookings().subscribe($userPlans => {
			this.userBookings = $userPlans;
			console.log(this.userBookings);
		});
	}

	ngOnInit() {}

	openDetails(page) {
		this.nav.openNav(page);
	}
}
