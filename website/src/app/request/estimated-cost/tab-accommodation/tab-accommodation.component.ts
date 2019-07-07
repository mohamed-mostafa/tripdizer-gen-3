import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelsService } from './hotels.service';

@Component({
	selector: 'c-app-tab-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent {

	hotels: Observable<Array<any>>;

	constructor(service: HotelsService) {
		this.hotels = service.getHotels();
	}
}
