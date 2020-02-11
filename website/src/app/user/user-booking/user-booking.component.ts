import { UserService } from './../user.service';
import { SideNavService } from './../side-nav.service';
import { Component } from '@angular/core';

@Component({
	selector: 'c-app-booking-plans',
	templateUrl: './user-booking.component.html',
	styleUrls: ['./user-booking.component.scss'],
})
export class UserBookingComponent {
	userBookings: Array<any> = [];
	constructor(public nav: SideNavService, public userService: UserService) {
		this.userService.getUserBookings().subscribe($userPlans => {
			this.userBookings = $userPlans;
			console.log(this.userBookings);
		});
	}

	openDetails(bookingData) {
		this.nav.openNav('plan_details', bookingData);
	}
}
