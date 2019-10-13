import { Component } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { Flight, FlightOffer } from './flight.model';
import { RequestService } from '../../request.service';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent {
	flights: Array<Flight>;
	flightPaths: Array<{ lat: number; lng: number }>;
	selectedFlightOffers = {};
	isLoading: boolean;
	get totalCost(): number {
		return Object.keys(this.selectedFlightOffers).reduce((pv, cv) => pv + +this.selectedFlightOffers[cv].price, 0);
	}

	constructor(private service: EstimatedCostService, requestService: RequestService) {
		requestService.setIsFlightsTabVisited(true);
		requestService.isLoading.subscribe(isLoadingObject => (this.isLoading = isLoadingObject.show));
		service.getFlights().subscribe(flights => {
			this.flights = flights.map((flight, flightIndex) => ({
				...flight,
				flightOffers: flight.flightOffers.map((fo, flightOfferIndex) => ({
					...fo,
					flightIndex,
					flightOfferIndex,
					departure: [...fo.segments].shift(),
					arrival: [...fo.segments].pop(),
					numberOfStops: fo.segments.length - 1,
				})),
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
		this.service.setCurrentTabIndex(2);
	}

	back(): void {
		this.service.setCurrentTabIndex(0);
	}

	offerChanged(flightOffer: FlightOffer): void {
		if (flightOffer) {
			this.selectedFlightOffers[flightOffer.flightIndex] = flightOffer;
		}
	}
}
