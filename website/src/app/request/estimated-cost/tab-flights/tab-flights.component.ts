import { Component } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { Flight } from './flight.model';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent {
	flights: Array<Flight>;
	flightPaths: Array<{ lat: number; lng: number }>;

	constructor(service: EstimatedCostService) {
		service.getFlights().subscribe(flights => {
			this.flights = flights;
			this.flightPaths = flights
				.filter(flight => flight.origin && flight.origin.latitude && flight.origin.longitude)
				.map(flight => ({ lat: flight.origin.latitude, lng: flight.origin.longitude }));
		});
	}
}
