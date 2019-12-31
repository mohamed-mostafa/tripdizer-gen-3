import { SummaryService } from './../../summary/summary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimatedCostService } from './../estimated-cost.service';
import { CityDTO } from './city-dto.model';
import { RequestService } from '../../request.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './tab-cities.component.html',
	styleUrls: ['./tab-cities.component.scss'],
})
export class TabCitiesComponent implements OnDestroy {
	cities: Array<CityDTO> = [];
	// selectedCities: Array<CityDTO> = [];
	cityPaths: Array<{ lat: number; lng: number }> = [];
	snackBar: MatSnackBar;
	currentStepPath: string;
	loadedData: boolean;
	private subscriptions = new Subscription();

	constructor(
		private service: EstimatedCostService,
		snackBar: MatSnackBar,
		private requestService: RequestService,
		private route: ActivatedRoute,
		private router: Router,
		public summaryService: SummaryService
	) {
		this.currentStepPath = this.route.routeConfig.path;
		this.snackBar = snackBar;
		this.cityPaths.push(service.travelingFromCoordinates);
		service.getCities().subscribe(citiesResult => {
			const numberOfNights = this.service.getNumberOfNights();
			const maxNumberOfCities = Math.ceil(numberOfNights / 1);
			let numberOfSelectedCities = 0;
			if (maxNumberOfCities < citiesResult.length) {
				numberOfSelectedCities = maxNumberOfCities;
			} else {
				numberOfSelectedCities = citiesResult.length;
			}

			// getCitiesResult.forEach(city => {
			// 	this.cities.push(city);
			// 	city.select = false;
			// });
			for (let b = 0; b < citiesResult.length; b++) {
				this.cities.push(citiesResult[b]);
				citiesResult[b].select = false;
				if (b + 1 <= numberOfSelectedCities) {
					citiesResult[b].select = true;
				}
			}

			this.cities.forEach(city => {
				const coordinates = city.coordinates.split(', ');
				this.cityPaths.push({ lat: Number(coordinates[0]), lng: Number(coordinates[1]) });
			});

			this.loadedData = true;
		});

		this.snackBar = snackBar;
		this.cityPaths.push(service.travelingFromCoordinates);
	}

	updateSelectedCities(city) {
		if (city.select === true) {
			for (let r = 0; r < this.cities.length; r++) {
				if (this.cities[r].iataCode === city.iataCode) {
					this.cities.splice(r, 1);
				}
			}
			for (const c of this.cities) {
				if (c.iataCode === city.iataCode) {
					c.select = false;
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
			const maxNumberOfCities = Math.ceil(numberOfNights / 2);
			if (this.cities.length >= maxNumberOfCities) {
				// prevent more selections
				this.snackBar.open('Too many cities for ' + numberOfNights + ' nights', 'Ok', {
					duration: 3000,
				});
			} else {
				// this.selectedCities.push(city); // this shouldn't be just 'push' because now cities order is not correct !!
				this.cities.splice(0, this.cities.length); // clear list
				this.cityPaths.splice(0, this.cityPaths.length);
				for (const c of this.cities) {
					// add all selected cities again
					if (c.select) {
						this.cities.push(c);
						const coordinates = c.coordinates.split(', ');
						this.cityPaths.push({ lat: Number(coordinates[0]), lng: Number(coordinates[1]) });
					}
					if (c.iataCode === city.iataCode) {
						c.select = true;
						this.cities.push(c); // add this newly selected city
						const coordinates2 = c.coordinates.split(', ');
						this.cityPaths.push({ lat: Number(coordinates2[0]), lng: Number(coordinates2[1]) });
					}
				}
			}
		}
		this.service.updateFlightsOffersInCache(null);
		this.service.updateAccommodationInCache(null);
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
		this.service.setCities(this.cities);
		// this.service.setSelectedCities(this.calculateCitiesNights(this.selectedCities));
		this.service.setCurrentTabIndex(1);
	}

	goBack(): void {
		this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
