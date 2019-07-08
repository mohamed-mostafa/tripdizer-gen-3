import { Component } from '@angular/core';
import { Flight } from './flight.model';
import { FlightsService } from './flights.service';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent {
	flights: Array<Flight>;
	flightPaths: Array<{ lat: number; lng: number }>;

	constructor(service: FlightsService) {
		service.getFlights().subscribe(flights => {
			this.flights = flights;
			this.flightPaths = flights.map(flight => ({ lat: flight.origin.latitude, lng: flight.origin.longitude }));
		});
	}
}
