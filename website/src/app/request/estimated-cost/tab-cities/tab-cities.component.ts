import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CitiesService } from './cities.service';
import { CityDTO } from './city-dto.model';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './tab-cities.component.html',
	styleUrls: ['./tab-cities.component.scss'],
})
export class TabCitiesComponent {
	cities: Observable<Array<CityDTO>>;

	constructor(service: CitiesService) {
		this.cities = service.getCities();
	}
}
