import { first, take } from 'rxjs/operators';
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
	selectedCities: Array<CityDTO> = [];
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
		public summaryService: SummaryService,
	) {
		this.currentStepPath = this.route.routeConfig.path;

		this.subscriptions.add(requestService.isCitiesTabVisited.pipe(first())
			.subscribe(isCitiesTabVisitedState => {
				console.log('isCitiesTabVisitedState', isCitiesTabVisitedState);

				if (isCitiesTabVisitedState === true) {
					this.cities = service.cachedTabsData.cities;
					this.generateCityPaths(this.cities);

					this.cities.forEach(city => {
						if (city.select) { this.selectedCities.push(city); }
					});
					this.loadedData = true;
					console.log('cache cities', this.cities);
				} else {
					console.log('cities', this.cities);
					service.getCities().subscribe(res => {
						const numberOfNights = this.service.getNumberOfNights();
						const maxNumberOfCities = Math.ceil(numberOfNights / 1);
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
							}
						}

						this.generateCityPaths(this.cities);
						this.loadedData = true;
						this.requestService.setIsFlightsTabVisited(false);
						this.requestService.setIsAccommodationTabVisited(false);
					});

					requestService.setIsCitiesTabVisited(true);
				}
			})
		);

		this.service.setCurrentTabIndex(0);

		this.snackBar = snackBar;
	}

	updateSelectedCities(city) {
		if (city.select === true) {
			for (let r = 0; r < this.selectedCities.length; r++) {
				if (this.selectedCities[r].iataCode === city.iataCode) {
					this.selectedCities.splice(r, 1);
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
			if (this.selectedCities.length >= maxNumberOfCities) {
				// prevent more selections
				this.snackBar.open('Too many cities for ' + numberOfNights + ' nights', 'Ok', {
					duration: 3000,
				});
			} else {
				// this.selectedCities.push(city); // this shouldn't be just 'push' because now cities order is not correct !!
				this.selectedCities.splice(0, this.selectedCities.length); // clear list
				this.cityPaths.splice(0, this.cityPaths.length);
				for (const c of this.cities) {
					// add all selected cities again
					if (c.select) {
						this.selectedCities.push(c);
						const coordinates = c.coordinates.split(', ');
						this.cityPaths.push({ lat: Number(coordinates[0]), lng: Number(coordinates[1]) });
					}
					if (c.iataCode === city.iataCode) {
						c.select = true;
						this.selectedCities.push(c); // add this newly selected city
						const coordinates2 = c.coordinates.split(', ');
						this.cityPaths.push({ lat: Number(coordinates2[0]), lng: Number(coordinates2[1]) });
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

	generateCityPaths(cities) {
		cities.forEach(city => {
			const coordinates = city.coordinates.split(', ');
			this.cityPaths.push({ lat: Number(coordinates[0]), lng: Number(coordinates[1]) });
		});
	}

	next(): void {
		this.service.setCitiesInCache(this.cities);
		this.service.setSelectedCities(this.calculateCitiesNights(this.selectedCities));
		this.service.setCurrentTabIndex(1);
	}

	goBack(): void {
		this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
