import { OwlCarousel } from 'ngx-owl-carousel';
import { FlightOffer } from './flight-offer.model';
import { Component, ViewChild, DoCheck } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent implements DoCheck {
	@ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;

	flightOffers: Array<FlightOffer>;
	flightPaths: Array<{ lat: number; lng: number }> = [];
	options: any;
	selectedSlide = 1;
	loadedApiData: boolean;

	constructor(private service: EstimatedCostService) {
		this.flightPaths = service.getCityPaths();

		service.getFlightsAndAccommodation();

		service.flightAndAccommodationOffersData.subscribe(result => {
			if (result && result.length) {
				this.loadedApiData = true;

				if (Array.isArray(result[0])) {
					this.flightOffers = result[0];

					this.flightOffers.forEach((flightOffer, i) => {
						if (flightOffer.selected) {
							setTimeout(() => {
								this.goToSlide(i);
							}, 0);
						}
					});
				}
			}
		});

		this.setSliderOptions();
	}

	updateSelectedFlightOffer(offer) {
		this.flightOffers.forEach(flightOffer => {
			flightOffer.selected = offer.fareSourceCode === flightOffer.fareSourceCode ? true : false;
		});
	}

	goNext(): void {
		this.service.tabsNavigate('flights', 'next');
	}

	goBack(): void {
		this.service.tabsNavigate('flights', 'back');
	}

	setSliderOptions() {
		this.options = {
			nav: true,
			dots: false,
			autoHeight: true,
			responsive: {
				0: {
					items: 1,
					margin: 10,
					slideBy: 1,
				},
			},
		};
	}

	goToSlide(i) {
		if (this.owlElement) {
			this.owlElement.to([i]);
			this.updateCurrentSlideIndex();
		}
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
