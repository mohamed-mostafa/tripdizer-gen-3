import { FlightOffer } from './flight-offer.model';
import { Component } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { RequestService } from '../../request.service';
import * as moment from 'moment';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent {
	flightOffers: Array<FlightOffer>;
	selectedFlightOffers = [];
	isLoading: boolean;
	flightPaths: Array<{ lat: number; lng: number }> = [];
	options: any;

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

			this.flightOffers.forEach(flightOffer => {
				flightOffer.flightLegs.forEach(flightLeg => {
					flightLeg.segments.forEach(segment => {
						segment.departure = moment(segment.departure).format('HH:mm');
						segment.arrival = moment(segment.arrival).format('HH:mm');
					});
				});
			});

			this.flightOffers[0].selected = true;
			this.selectedFlightOffers.push(this.flightOffers[0]);

		});

		this.setSliderOptions();
	}

	selectOffer(offer) {
		console.log(offer);
		this.flightOffers.forEach(flightOffer => {
			if (offer.fareSourceCode === flightOffer.fareSourceCode) {
				flightOffer.selected = true;
			} else {
				flightOffer.selected = false;
			}
			this.selectedFlightOffers = [];
			this.selectedFlightOffers.push(offer);
		});
		console.log(this.selectedFlightOffers);
	}

	next(): void {
		// const selectedOffers = Object.keys(this.selectedFlightOffers).map(key => {
		// 	const returnedFlightOffer: FlightOffer = this.selectedFlightOffers[key];
		// 	delete returnedFlightOffer.flightIndex;
		// 	return returnedFlightOffer;
		// });

		this.service.setSelectedFlightOffers(this.selectedFlightOffers);
		this.service.setCurrentTabIndex(2);
	}

	back(): void {
		this.service.setCurrentTabIndex(0);
	}

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
