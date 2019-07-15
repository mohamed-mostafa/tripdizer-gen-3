import { City } from './../../../shared/models/city.model';
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
	selectedCities: Array<City>;

	constructor(service: CitiesService) {
		this.cities = service.getCities();
		console.log(this.cities);
	}

	updateSelectedCities(city, e) {
		
		if (e.checked === true) {
			this.selectedCities.push(city);
		} else if (e.checked === false) {
			for (let x = 0; x < this.selectedCities.length; x++) {
				if (this.selectedCities[x].iataCode === city.iataCode) {
					this.selectedCities.splice(x, 1);
				}
			}
		}

		console.log(this.selectedCities);
	}
}
