import { UserBooking } from './../user-booking.model';
import { Component } from '@angular/core';
import { SideNavService } from '../../side-nav.service';

@Component({
	selector: 'c-app-booking-details',
	templateUrl: './booking-details.component.html',
	styleUrls: ['./booking-details.component.scss'],
})
export class BookingDetailsComponent {
	bookingDetails: Array<UserBooking[]>;

	constructor(private sideNavService: SideNavService) {
		this.sideNavService.navContent.subscribe(nc => {
			if (nc && nc.data) {
				this.bookingDetails = nc.data;
			}
		});
	}

	closeNav() {
		this.sideNavService.closeNav();
	}
}
