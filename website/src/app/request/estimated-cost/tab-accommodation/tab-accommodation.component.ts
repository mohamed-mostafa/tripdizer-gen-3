import { Accommodation, Hotel } from './accommodation.model';
import { EstimatedCostService } from './../estimated-cost.service';
import { Component } from '@angular/core';

@Component({
	selector: 'c-estimated-cost-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent {

	accommodations: Array<Accommodation> = [];
	selectedHotels: Array<Hotel> = [];
	totalCost = 0;

	constructor(private service: EstimatedCostService) {
		service.getAccommodation().subscribe(res => {
			const items = res;
			console.log(res);
			for (let b = 0; b < items.length; b++) {
				items[b].hotels[0].select = true;
				this.accommodations.push(items[b]);
				this.selectedHotels.push(items[b].hotels[0]);
				this.totalCost = this.totalCost + items[b].hotels[0].price;
				console.log(this.accommodations);
				console.log(this.selectedHotels);
				console.log(this.totalCost);
			}

		});
	}

	selectHotel(hotel) {
		for (let c = 0; c < this.accommodations.length; c++) {
			if (this.accommodations[c].city.name === hotel.city) {
				for (let d = 0; d < this.accommodations[c].hotels.length; d++) {
					if (this.accommodations[c].hotels[d].id === hotel.id) {
						this.accommodations[c].hotels[d].select = true;
					} else {
						this.accommodations[c].hotels[d].select = false;
					}
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

	next() {
		this.service.setSelectedHotels(this.selectedHotels);
		this.service.setCurrentTabIndex(4);
	}
}
