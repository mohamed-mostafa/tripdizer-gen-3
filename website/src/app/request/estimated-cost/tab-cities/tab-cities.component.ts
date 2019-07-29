import { Component } from '@angular/core';
import { EstimatedCostService } from './../estimated-cost.service';
import { CityDTO } from './city-dto.model';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './tab-cities.component.html',
	styleUrls: ['./tab-cities.component.scss'],
})
export class TabCitiesComponent {
	cities: Array<CityDTO> = [];
	selectedCities: Array<CityDTO> = [];

	constructor(private service: EstimatedCostService) {
		service.getCities().subscribe(
			res => {
				for (let b = 0; b < res.length; b++) {
					res[b].select = true;
					this.selectedCities.push(res[b]);
					this.cities.push(res[b]);
				}
			}
		);
	}

	updateSelectedCities(city) {
		if (city.select === true) {
			for (let r = 0; r < this.selectedCities.length; r++) {
				if (this.selectedCities[r].iataCode === city.iataCode) {
					this.selectedCities.splice(r, 1);
				}
			}
			for (let d = 0; d < this.cities.length; d++) {
				if (this.cities[d].iataCode === city.iataCode) {
					this.cities[d].select = false;
				}
			}
		} else if (city.select === false) {
			this.selectedCities.push(city);
			for (let x = 0; x < this.cities.length; x++) {
				if (this.cities[x].iataCode === city.iataCode) {
					this.cities[x].select = true;
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
			numberOfNights: index === 0 ? floorDivision + modulus : floorDivision,
		}));
	}

	next(): void {
		this.service.setSelectedCities(this.calculateCitiesNights(this.selectedCities));
		this.service.setCurrentTabIndex(1);
	}
}
