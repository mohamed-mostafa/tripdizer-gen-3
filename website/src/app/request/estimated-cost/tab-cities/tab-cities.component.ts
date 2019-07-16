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
	selectedCities: Array<CityDTO> = [];
	nightsArray: Array<number> = [];

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

	calculateCitiesNights(nights, cities) {
		const floorDivision = Math.floor(nights / cities);
		const modulus = nights % cities;
		for (let z = 0; z < cities; z++) { this.nightsArray[z] = floorDivision; }
		return this.nightsArray[0] + modulus;
	}

	next(): void {

	}
}
