import { Accommodation } from './accommodation.model';
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

	constructor(service: EstimatedCostService) {
		this.accommodations = service.getAccommodation();
	}
}
