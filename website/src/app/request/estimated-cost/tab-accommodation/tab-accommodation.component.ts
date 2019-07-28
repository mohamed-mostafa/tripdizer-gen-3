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
			console.log(items);
			for (let b = 0; b < items.length; b++) {
				items[b].hotels[0].select = true;
				this.newAccommodation.push(items[b]);
				this.selectedHotels.push(items[b].hotels[0]);
				// items[b].select = true;
				// this.selectedCities.push(items[b]);
				// this.newCities.push(items[b]);
			}
		});
	}

	selectHotel(hotel, hotels) {
		Object.keys(hotels).forEach(h => {
			if (hotels[h].id === hotel.id) {
				hotels[h].disabled = false;
			} else {
				hotels[h].disabled = true;
			}
		});
		this.selectedHotels.push(hotel);
		console.log(this.selectedHotels);
	}

	unSelectHotel(id, hotels) {
		Object.keys(hotels).forEach(h => {
			hotels[h].disabled = false;
		});

		for (let x = 0; x < this.selectedHotels.length; x++) {
			if (this.selectedHotels[x].id === id) {
				this.selectedHotels.splice(x, 1);
			}
		}
		console.log(this.selectedHotels);
	}

	next() {
		this.service.setCurrentTabIndex(4);
	}
}
