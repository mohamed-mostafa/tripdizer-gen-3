import { City } from './city.model';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CitiesService } from './cities.service';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './tab-cities.component.html',
	styleUrls: ['./tab-cities.component.scss'],
})
export class TabCitiesComponent {
	cities: Observable<Array<City>>;

	constructor(service: CitiesService) {
		this.cities = service.getCities();
	}
}
