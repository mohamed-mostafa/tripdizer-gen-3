import { OwlCarousel } from 'ngx-owl-carousel';
import { FlightOffer } from './flight-offer.model';
import { Component, ViewChild, DoCheck } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { RequestService } from '../../request.service';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent implements DoCheck {

	@ViewChild('owlElement') owlElement: OwlCarousel;

	flightOffers: Array<FlightOffer>;
	selectedFlightOffers = [];
	isLoading: boolean;
	flightPaths: Array<{ lat: number; lng: number }> = [];
	options: any;
	selectedSlide = 1;

	constructor(private service: EstimatedCostService, requestService: RequestService) {
		requestService.setIsFlightsTabVisited(true);
		requestService.isLoading.subscribe(isLoadingObject => (this.isLoading = isLoadingObject.show));

		service.getSelectedCities().forEach(city => {
			const cityLatLong = city.coordinates.split(',');
			this.flightPaths.push({ lat: Number(cityLatLong[0]), lng: Number(cityLatLong[1]) });
		});


		service.getFlightOffers().subscribe(flightOffers => {
			if (flightOffers) {
				this.flightOffers = flightOffers;
				this.flightOffers[0].selected = true;
				this.selectedFlightOffers.push(this.flightOffers[0]);
			}
		}, error => {
			this.flightOffers = [];
		});

		this.setSliderOptions();
	}

	selectOffer(offer) {
		this.flightOffers.forEach(flightOffer => {
			if (offer.fareSourceCode === flightOffer.fareSourceCode) {
				flightOffer.selected = true;
			} else {
				flightOffer.selected = false;
			}
			this.selectedFlightOffers = [];
			this.selectedFlightOffers.push(offer);
		});
	}

	next(): void {
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

	goToSlide(i) {
		this.owlElement.to([i]);
		this.updateCurrentSlideIndex();
	}

	nextSlide() {
		this.owlElement.next();
		this.updateCurrentSlideIndex();
	}

	previousSlide() {
		this.owlElement.previous();
		this.updateCurrentSlideIndex();
	}

	updateCurrentSlideIndex() {
		this.selectedSlide = this.owlElement.$owlChild.currentSlideIndex + 1;
	}

	ngDoCheck() {
		if (this.owlElement && this.owlElement.$owlChild) {
			this.selectedSlide = this.owlElement.$owlChild.currentSlideIndex + 1;
		}
	}
}
