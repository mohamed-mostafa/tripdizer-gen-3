import { OwlCarousel } from 'ngx-owl-carousel';
import { FlightOffer } from './flight-offer.model';
import { Component, ViewChild, DoCheck, OnDestroy } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost.service';
import { RequestService } from '../../request.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-estimated-cost-flights',
	templateUrl: './tab-flights.component.html',
	styleUrls: ['./tab-flights.component.scss'],
})
export class TabFlightsComponent implements DoCheck, OnDestroy {
	@ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;

	flightOffers: Array<FlightOffer>;
	flightPaths: Array<{ lat: number; lng: number }> = [];
	options: any;
	selectedSlide = 1;
	private subscriptions = new Subscription();

	constructor(private service: EstimatedCostService, requestService: RequestService) {

		this.flightPaths = service.getCityPaths();

		this.subscriptions.add(
			service.getFlightOffers().subscribe(flightOffersResult => {
				this.flightOffers = flightOffersResult;

				this.flightOffers.forEach((flightOffer, i) => {
					if (flightOffer.selected) {
						setTimeout(() => {
							this.goToSlide(i);
						}, 0);
					}
				});
			})
		);

		this.setSliderOptions();
	}

	updateSelectedFlightOffer(offer) {
		this.flightOffers.forEach(flightOffer => {
			flightOffer.selected = offer.fareSourceCode === flightOffer.fareSourceCode ? true : false;
		});
	}

	goNext(): void {
		this.service.setCurrentTabIndex(2);
	}

	goBack(): void {
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
