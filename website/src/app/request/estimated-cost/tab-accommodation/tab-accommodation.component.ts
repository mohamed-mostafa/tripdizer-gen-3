import { OwlCarousel } from 'ngx-owl-carousel';
import { Component, ViewChild } from '@angular/core';
import { EstimatedCostService } from './../estimated-cost.service';
import { Accommodation, Hotel } from './accommodation.model';
import { RequestService } from '../../request.service';

@Component({
	selector: 'c-estimated-cost-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent {

	@ViewChild('owlElement') owlElement: OwlCarousel;

	accommodations: Array<Accommodation> = [];
	selectedHotels: Array<Hotel> = [];
	totalCost = 0;
	loadedData: boolean;
	options: any;
	carousel: OwlCarousel;

	constructor(private service: EstimatedCostService, requestService: RequestService) {
		requestService.setIsAccommodationTabVisited(true);
		service.getAccommodation().subscribe(res => {
			this.loadedData = true;
			const items = res;
			for (const item of items) {
				if (item.hotels.length > 0) {
					item.hotels[0].select = true;
					this.accommodations.push(item);
					this.selectedHotels.push(item.hotels[0]);
					this.totalCost = this.totalCost + item.hotels[0].price;
				}
			}

			this.setSliderOptions();

			// to remove when api is ready
			this.accommodations[0].hotels = [...this.accommodations[0].hotels, ...this.accommodations[0].hotels, ...this.accommodations[0].hotels];
			console.log(this.accommodations);

		});
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
					slideBy: 2
				},
				1000: {
					items: 3,
					margin: 10,
					slideBy: 3
				},
			},
		};
	}

	next() {
		this.service.setSelectedHotels(this.selectedHotels);
		this.service.setCurrentTabIndex(4);
	}

	back(): void {
		this.service.setCurrentTabIndex(1);
	}

	nextSlide() {
		this.owlElement.next();
	}

	PrevSlide() {
		this.owlElement.previous();
	}
}
