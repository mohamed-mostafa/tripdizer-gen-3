import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SideNavService } from './../side-nav.service';
import { UserService } from './../user.service';
import { UserBooking } from './user-booking.model';

@Component({
	selector: 'c-app-booking-plans',
	templateUrl: './user-booking.component.html',
	styleUrls: ['./user-booking.component.scss'],
})
export class UserBookingComponent {
	userBookings: Observable<Array<UserBooking>>;

	constructor(private sideNavService: SideNavService, private userService: UserService) {
		this.userBookings = this.userService.getUserBookings();	
	}

	openDetails(bookingData) {
		this.sideNavService.openNav('booking_details', bookingData);
	}
}
