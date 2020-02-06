import { SideNavService } from './../side-nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'c-app-booking-plans',
	templateUrl: './user-booking.component.html',
	styleUrls: ['./user-booking.component.scss'],
})
export class UserBookingComponent implements OnInit {
	constructor(public nav: SideNavService) {}

	ngOnInit() {}

	openDetails(page) {
		this.nav.openNav(page);
	}
}
