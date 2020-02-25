import { OwlCarousel } from 'ngx-owl-carousel';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { EstimatedCostService } from './../estimated-cost.service';
import { Accommodation, Hotel } from './accommodation.model';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'c-estimated-cost-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent {
	@ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;
	accommodationOffers: Array<Accommodation> = [];
	selectedHotels: Array<Hotel> = [];
	totalCost: number;
	currentStepPath: string;
	options: any;
	carousel: OwlCarousel;
	loadedApiData: boolean;

	constructor(private service: EstimatedCostService, private route: ActivatedRoute) {
		this.currentStepPath = this.route.routeConfig.path;

		service.getAccommodationOffers().subscribe(accommodationOffersResult => {
			this.loadedApiData = true;
			if (accommodationOffersResult && Array.isArray(accommodationOffersResult)) {
				this.accommodationOffers = accommodationOffersResult;
				this.updateTotalCostOfSelected();
			}
		});
		this.setSliderOptions();
	}

	selectAccommodationOffer(hotel) {
		if (!hotel.selected) {
			for (const ac of this.accommodationOffers) {
				if (ac.city.name === hotel.city) {
					for (const h of ac.hotels) {
						h.selected = h.id === hotel.id;
					}
				}
			}
		}
		this.updateTotalCostOfSelected();
		this.service.setAccommodationOffers(this.accommodationOffers);
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
				},
				600: {
					items: 2,
					margin: 10,
					slideBy: 2,
				},
				1000: {
					items: 3,
					margin: 10,
					slideBy: 3,
				},
			},
		};
	}

	updateTotalCostOfSelected() {
		this.totalCost = 0;
		this.accommodationOffers.map(offer => {
			offer.hotels
				.filter(hotel => hotel.selected)
				.map(h => {
					this.totalCost = +h.price;
				});
		});
	}

	goNext() {
		this.service.tabsNavigate('accommodation', 'next', this.currentStepPath, this.route);
	}

	goBack(): void {
		this.service.tabsNavigate('accommodation', 'back');
	}
}
