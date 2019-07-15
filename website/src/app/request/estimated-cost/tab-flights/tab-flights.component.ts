import { Component } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { Flight, FlightOffer } from './flight.model';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent {
	flights: Array<Flight>;
	flightPaths: Array<{ lat: number; lng: number }>;
	selectedFlightOffers = {};

	get totalCost(): number {
		return Object.keys(this.selectedFlightOffers).reduce((pv, cv) => pv + this.selectedFlightOffers[cv].price, 0);
	}

	constructor(private service: EstimatedCostService) {
		service.getFlights().subscribe(flights => {
			this.flights = flights.map((flight, index) => ({
				...flight,
				flightOffers: flight.flightOffers.map(fo => ({ ...fo, flightIndex: index })),
			}));
			this.flightPaths = flights
				.filter(flight => flight.origin && flight.origin.latitude && flight.origin.longitude)
				.map(flight => ({ lat: flight.origin.latitude, lng: flight.origin.longitude }));
		});
	}

	next(): void {
		const selectedOffers = Object.keys(this.selectedFlightOffers).map(key => {
			const returnedFlightOffer: FlightOffer = this.selectedFlightOffers[key];
			delete returnedFlightOffer.flightIndex;
			return returnedFlightOffer;
		});

		this.service.setSelectedFlightOffers(selectedOffers);
	}

	offerChanged(flightOffer: FlightOffer): void {
		if (flightOffer) {
			this.selectedFlightOffers[flightOffer.flightIndex] = flightOffer;
		}
	}
}
