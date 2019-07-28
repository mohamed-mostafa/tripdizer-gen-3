import { Accommodation, Hotel } from './accommodation.model';
import { EstimatedCostService } from './../estimated-cost.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'c-estimated-cost-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent {

	accommodations: Observable<Array<Accommodation>>;
	selectedHotels: Array<Hotel> = [];
	newAccommodation: Array<Accommodation> = [];

	constructor(private service: EstimatedCostService) {
		this.accommodations = service.getAccommodation();

		this.accommodations.subscribe(res => {
			const items = res;
			for (let b = 0; b < items.length; b++) {
				items[b].hotels[0].select = true;
				this.newAccommodation.push(items[b]);
				this.selectedHotels.push(items[b].hotels[0]);
			}
		});
	}

	selectHotel(hotel) {
		for (let c = 0; c < this.newAccommodation.length; c++) {
			if (this.newAccommodation[c].city.name === hotel.city) {
				for (let d = 0; d < this.newAccommodation[c].hotels.length; d++) {
					if (this.newAccommodation[c].hotels[d].id === hotel.id) {
						this.newAccommodation[c].hotels[d].select = true;
					} else {
						this.newAccommodation[c].hotels[d].select = false;
					}
				}
			}
		}
		for (let e = 0; e < this.selectedHotels.length; e++) {
			if (this.selectedHotels[e].city === hotel.city) {
				this.selectedHotels.splice(e, 1);
				break;
			}
		}
		this.selectedHotels.push(hotel);
	}

	next() {
		this.service.setCurrentTabIndex(4);
	}
}
