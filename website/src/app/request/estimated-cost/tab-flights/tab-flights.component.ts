import { Component } from '@angular/core';
import { FlightsService } from './flights.service';
import { Observable } from 'rxjs';
import { Flight } from './flight.model';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent {
	flights: Observable<Array<Flight>>;

	constructor(service: FlightsService) {
		this.flights = service.getFlights();
	}
}
