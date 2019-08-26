import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimatedCostService } from './../estimated-cost.service';
import { CityDTO } from './city-dto.model';
import { RequestService } from '../../request.service';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './tab-cities.component.html',
	styleUrls: ['./tab-cities.component.scss'],
})
export class TabCitiesComponent {

	cities: Array<CityDTO> = [];
	selectedCities: Array<CityDTO> = [];
	cityPaths: Array<{ lat: number; lng: number }> = [];
	snackBar: MatSnackBar;
	currentStepPath: string;
	loadedData: boolean;

	constructor(
		private service: EstimatedCostService,
		snackBar: MatSnackBar,
		private requestService: RequestService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.currentStepPath = this.route.routeConfig.path;
		this.service.setCurrentTabIndex(0);
		requestService.setIsCitiesTabVisited(true);
		this.snackBar = snackBar;
		service.getCities().subscribe(
			res => {
				this.loadedData = true;
				const numberOfNights = this.service.getNumberOfNights();
				const maxNumberOfCities = Math.ceil(numberOfNights / 2);
				let numberOfSelectedCities = 0;
				if (maxNumberOfCities < res.length) {
					numberOfSelectedCities = maxNumberOfCities;
				} else {
					numberOfSelectedCities = res.length;
				}
				for (let b = 0; b < res.length; b++) {
					this.cities.push(res[b]);
					res[b].select = false;
					if (b + 1 <= numberOfSelectedCities) {
						res[b].select = true;
						this.selectedCities.push(res[b]);
						const coordinates = res[b].coordinates.split(', ');
						this.cityPaths.push({ lat: Number(coordinates[0]), lng: Number(coordinates[1]) });
					}
				}

				this.requestService.setIsFlightsTabVisited(false);
				this.requestService.setIsAccommodationTabVisited(false);
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
			for (let m = 0; m < this.cityPaths.length; m++) {
				const coordinates = city.coordinates.split(', ');
				if (Number(coordinates[0]) === this.cityPaths[m].lat && Number(coordinates[1]) === this.cityPaths[m].lng) {
					this.cityPaths.splice(m, 1);
				}
			}
		} else if (city.select === false) {
			// check if no more cities should be selected
			const numberOfNights = this.service.getNumberOfNights();
			const maxNumberOfCities = Math.ceil(numberOfNights / 1);
			if (this.selectedCities.length >= maxNumberOfCities) {
				// prevent more selections
				this.snackBar.open('Too many cities for ' + numberOfNights + ' nights', 'Ok', {
					duration: 3000
				});
			} else {
				// this.selectedCities.push(city); // this shouldn't be just 'push' because now cities order is not correct !!
				this.selectedCities.splice(0, this.selectedCities.length); // clear list
				this.cityPaths.splice(0, this.cityPaths.length);
				for (let x = 0; x < this.cities.length; x++) {
					if (this.cities[x].select) { this.selectedCities.push(this.cities[x]); } // add all selected cities again
					if (this.cities[x].iataCode === city.iataCode) {
						this.cities[x].select = true;
						this.selectedCities.push(this.cities[x]); // add this newly selected city
						const coordinates = city.coordinates.split(', ');
						this.cityPaths.push({ lat: Number(coordinates[0]), lng: Number(coordinates[1]) });
					}
				}
			}
		}

		this.requestService.setIsFlightsTabVisited(false);
		this.requestService.setIsAccommodationTabVisited(false);
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

	goBack(): void {
		this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
	}
}
