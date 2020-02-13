import { UserService } from './../user.service';
import { SideNavService } from './../side-nav.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'c-app-booking-plans',
	templateUrl: './user-booking.component.html',
	styleUrls: ['./user-booking.component.scss'],
})
export class UserBookingComponent {
	userBookings: Observable<Array<any>>;
	constructor(private sideNavService: SideNavService, public userService: UserService) {
		this.userBookings = this.userService.getUserBookings();
	}

	openDetails(bookingData) {
		this.sideNavService.openNav('plan_details', bookingData);
	}
}
