import { EstimatedCostService } from './../estimated-cost.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CityDTO } from './city-dto.model';
import { map } from 'rxjs/operators';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './tab-cities.component.html',
	styleUrls: ['./tab-cities.component.scss'],
})
export class TabCitiesComponent {
	cities: Observable<Array<CityDTO>>;
	selectedCities: Array<CityDTO> = [];
	newCities: Array<CityDTO> = [];

	constructor(private service: EstimatedCostService) {
		this.cities = service.getCities();

		this.cities.subscribe(res => {
			const items = res;
			for (let b = 0; b < items.length; b++) {
				items[b].select = true;
				this.selectedCities.push(items[b]);
				this.newCities.push(items[b]);
			}
		});
	}

	updateSelectedCities(city) {
		if (city.select === true) {
			for (let r = 0; r < this.selectedCities.length; r++) {
				if (this.selectedCities[r].iataCode === city.iataCode) {
					this.selectedCities.splice(r, 1);
				}
			}
			for (let d = 0; d < this.newCities.length; d++) {
				if (this.newCities[d].iataCode === city.iataCode) {
					this.newCities[d].select = false;
				}
			}
		} else if (city.select === false) {
			this.selectedCities.push(city);
			for (let x = 0; x < this.newCities.length; x++) {
				if (this.newCities[x].iataCode === city.iataCode) {
					this.newCities[x].select = true;
				}
			}
		}
	}

	calculateCitiesNights(cities: Array<CityDTO>): Array<CityDTO> {
		const numberOfNights = this.service.getNumberOfNights();
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
		this.service.setCurrentTabIndex(1);
	}
}
