import { OwlCarousel } from 'ngx-owl-carousel';
import { Component, ViewChild } from '@angular/core';
import { EstimatedCostService } from './../estimated-cost.service';
import { Accommodation, Hotel } from './accommodation.model';
import { RequestService } from '../../request.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'c-estimated-cost-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent {
	@ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;

	accommodationOffers: Array<Accommodation>;
	accommodations: Array<Accommodation> = [];
	selectedHotels: Array<Hotel> = [];
	totalCost = 0;
	loadedData: boolean;
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
		requestService.setIsAccommodationTabVisited(true);
		service.getAccommodation().subscribe(
			res => {
				this.loadedData = true;
				this.accommodationOffers = res;
				for (const accommodationOffer of this.accommodationOffers) {
					if (accommodationOffer.hotels.length > 0) {
						accommodationOffer.hotels[0].select = true;
						this.accommodations.push(accommodationOffer);
						this.selectedHotels.push(accommodationOffer.hotels[0]);
						this.totalCost = this.totalCost + accommodationOffer.hotels[0].price;
					}
				}
			},
			error => {
				this.accommodations = [];
			}
		);
		this.setSliderOptions();
	}

	selectHotel(hotel) {
		if (!hotel.select) {
			for (const ac of this.accommodations) {
				if (ac.city.name === hotel.city) {
					for (const h of ac.hotels) {
						h.select = h.id === hotel.id;
					}
				}
			}
			for (let e = 0; e < this.selectedHotels.length; e++) {
				if (this.selectedHotels[e].city === hotel.city) {
					this.totalCost = this.totalCost - this.selectedHotels[e].price;
					this.selectedHotels.splice(e, 1);
					break;
				}
			}
			this.selectedHotels.push(hotel);
			this.totalCost = this.totalCost + hotel.price;
		}
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

	next() {
		this.service.setSelectedHotels(this.selectedHotels);
		this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
	}

	back(): void {
		this.service.setCurrentTabIndex(1);
	}
}
