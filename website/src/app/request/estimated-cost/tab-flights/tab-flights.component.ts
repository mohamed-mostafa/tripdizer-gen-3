import { FlightOffer } from './flight-offer.model';
import { Component } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { RequestService } from '../../request.service';
import { CityDTO } from '../tab-cities/city-dto.model';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent {
	flightOffers: Array<FlightOffer>;
	selectedFlightOffers = {};
	isLoading: boolean;
	flightPaths: Array<{ lat: number; lng: number }> = [];
	options: any;
	// get totalCost(): number {
	// 	return Object.keys(this.selectedFlightOffers).reduce((pv, cv) => pv + +this.selectedFlightOffers[cv].price, 0);
	// }

	constructor(private service: EstimatedCostService, requestService: RequestService) {
		requestService.setIsFlightsTabVisited(true);
		requestService.isLoading.subscribe(isLoadingObject => (this.isLoading = isLoadingObject.show));

		service.getSelectedCities().forEach(city => {
			const cityLatLong = city.coordinates.split(',');
			this.flightPaths.push({ lat: Number(cityLatLong[0]), lng: Number(cityLatLong[1]) });
		});

		console.log(this.flightPaths);

		service.getFlightOffers().subscribe(flightOffers => {
			console.log(flightOffers);
			this.flightOffers = flightOffers;
			// this.flightOffers = flightOffers.map((flightOffer, flightIndex) => ({
			// 	...flightOffer,
			// 	flightOffers: flightOffers.map((fo, flightOfferIndex) => ({
			// 		...fo,
			// 		flightIndex,
			// 		flightOfferIndex,
			// 		departure: [...fo.flightLegs['0'].segments].shift(),
			// 		arrival: [...fo.flightLegs[fo.flightLegs.length - 1].segments].pop(),
			// 		numberOfStops: fo.flightLegs.segments.length - 1,
			// 	})),
			// }));
			// console.log(flightOffers);
			// this.flightPaths = flightOffers
			// 	.filter(flightOffer => flightOffer.origin && flightOffer.origin.latitude && flightOffer.origin.longitude)
			// 	.map(flightOffer => ({ lat: flightOffer.origin.latitude, lng: flightOffer.origin.longitude }));
			// this.flightOffers = flightOffers;
			// console.log(flightOffers);
			// console.log(this.flightPaths);
		});

		this.setSliderOptions();
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

	// offerChanged(flightOffer: FlightOffer): void {
	// 	if (flightOffer) {
	// 		this.selectedFlightOffers[flightOffer.flightIndex] = flightOffer;
	// 	}
	// }

	setSliderOptions() {
		this.options = {
			nav: true,
			dots: false,
			responsive: {
				0: {
					items: 1,
					margin: 10,
					slideBy: 1,
				}
			}
		};
	}
}
