import { Component } from '@angular/core';
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
	accommodations: Array<Accommodation> = [];
	selectedHotels: Array<Hotel> = [];
	totalCost = 0;
	loadedData: boolean;
	currentStepPath: string;

	constructor(
		private service: EstimatedCostService,
		public requestService: RequestService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.currentStepPath = this.route.routeConfig.path;
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

	next() {
		this.service.setSelectedHotels(this.selectedHotels);
		// this.service.setCurrentTabIndex(4);
		this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
	}

	back(): void {
		this.service.setCurrentTabIndex(1);
	}
}
