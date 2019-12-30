import { OwlCarousel } from 'ngx-owl-carousel';
import { FlightOffer } from './flight-offer.model';
import { Component, ViewChild, DoCheck } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { RequestService } from '../../request.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent implements DoCheck {
	@ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;

	flightOffers: Array<FlightOffer>;
	selectedFlightOffers = [];
	isLoading: boolean;
	flightPaths: Array<{ lat: number; lng: number }> = [];
	options: any;
	selectedSlide = 1;
	afterReloadSlideIndex: number;
	hasFlightOffers: boolean;
	private subscriptions = new Subscription();

	constructor(private service: EstimatedCostService, requestService: RequestService) {
		this.hasFlightOffers = false;
		requestService.isLoading.subscribe(isLoadingObject => (this.isLoading = isLoadingObject.show));

		service.getFlightOffers().subscribe(flightOffers => {
			if (flightOffers && Array.isArray(flightOffers) && flightOffers.length > 0) {
				this.hasFlightOffers = true;
				this.flightOffers = flightOffers;

				let hasSelectedFlightOffer = false;

				this.flightOffers.forEach(flightOffer => {
					if (flightOffer.selected) {
						hasSelectedFlightOffer = true;
						this.afterReloadSlideIndex = this.flightOffers.indexOf(flightOffer) + 1;
						setTimeout(() => {
							this.goToSlide(this.flightOffers.indexOf(flightOffer));
						}, 0);
					}

					if (!hasSelectedFlightOffer) {
						this.flightOffers[0].selected = true;
						this.selectedFlightOffers.push(this.flightOffers[0]);
					}
				});
			}
		});

		service.getSelectedCities().forEach(city => {
			const cityLatLong = city.coordinates.split(',');
			this.flightPaths.push({ lat: Number(cityLatLong[0]), lng: Number(cityLatLong[1]) });
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
		this.service.updateFlightsOffersInCache(this.flightOffers);
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

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
