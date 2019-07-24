import { EstimatedCostService } from './../estimated-cost.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CityDTO } from './city-dto.model';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './tab-cities.component.html',
	styleUrls: ['./tab-cities.component.scss'],
})
export class TabCitiesComponent {
	cities: Observable<Array<CityDTO>>;
	selectedCities: Array<CityDTO> = [];

	constructor(private service: EstimatedCostService) {
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
	}

	calculateCitiesNights(cities: Array<CityDTO>): Array<CityDTO> {
		const numberOfNights = this.service.getNumberOfNights();
		console.log('numberOfNights', numberOfNights);
		const citiesLength = cities.length;

		const floorDivision = Math.floor(numberOfNights / citiesLength);
		const modulus = numberOfNights % citiesLength;
		return cities.map((city: CityDTO, index) => ({
			...city,
			numberOfNights: index === 0 ? floorDivision + modulus : floorDivision
		}));
	}

	next(): void {
		this.service.setSelectedCities(this.calculateCitiesNights(this.selectedCities));
		this.service.setCurrentTabIndex(2);
	}
}
