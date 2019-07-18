import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelsService } from './accommodations.service';

@Component({
	selector: 'c-estimated-cost-accommodation',
	templateUrl: './tab-accommodation.component.html',
	styleUrls: ['./tab-accommodation.component.scss'],
})
export class TabAccommodationComponent {

	accommodations: Observable<Array<any>>;

	constructor(service: HotelsService) {
		this.accommodations = service.getHotels();
		console.log(this.accommodations);
	}
}
