import { OwlCarousel } from 'ngx-owl-carousel';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { EstimatedCostService } from './../estimated-cost.service';
import { Accommodation, Hotel } from './accommodation.model';
import { RequestService } from '../../request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-estimated-cost-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent implements OnDestroy {
	@ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;

	private subscriptions = new Subscription();
	accommodationOffers: Array<Accommodation> = [];
	selectedHotels: Array<Hotel> = [];
	totalCost: number;
	currentStepPath: string;
	options: any;
	carousel: OwlCarousel;

	constructor(
		private service: EstimatedCostService,
		public requestService: RequestService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.currentStepPath = this.route.routeConfig.path;

		this.subscriptions.add(
			service.getAccommodationOffers().subscribe(accommodationOffersResult => {
				this.accommodationOffers = accommodationOffersResult;
				this.updateTotalCostOfSelected();
			})
		);
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

	next() {
		this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
	}

	back(): void {
		this.service.setCurrentTabIndex(1);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
