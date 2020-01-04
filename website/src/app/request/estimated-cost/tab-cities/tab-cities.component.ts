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
	cityPaths: any = [];
	snackBar: MatSnackBar;
	currentStepPath: string;
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

		service.getCities().subscribe(citiesResult => {
			this.cities = citiesResult;
			this.updateCitiesPaths();
			this.service.setCities(this.cities);
		});
	}

	updateSelectedCities(city: CityDTO) {
		if (city.selected) {
			this.cities.forEach(c => {
				if (c.iataCode === city.iataCode) {
					c.selected = false;
				}
			});
			this.updateCitiesPaths();
		} else {
			const numberOfNights = this.service.getNumberOfNights();
			if (this.getSelectedCities().length >= this.service.getMaxNumberOfCities()) {
				this.snackBar.open('Too many cities for ' + numberOfNights + ' nights', 'Ok', {
					duration: 3000,
				});
			} else {
				this.cities.forEach(c => {
					if (c.iataCode === city.iataCode) {
						c.selected = true;
					}
				});
				this.updateCitiesPaths();
			}
		}
		this.service.setCities(this.cities);
	}

	getSelectedCities(): Array<CityDTO> {
		return this.cities.filter(c => c.selected);
	}

	calculateCitiesNights(): Array<CityDTO> {
		const numberOfNights = this.service.getNumberOfNights();
		const floorDivision = Math.floor(numberOfNights / this.getSelectedCities().length);
		const modulus = numberOfNights % this.getSelectedCities().length;
		return this.getSelectedCities().map((city: CityDTO, index) => ({
			...city,
			numberOfNights: index === 0 ? floorDivision + modulus : floorDivision,
		}));
	}

	next(): void {
		// this.service.setCities(this.calculateCitiesNights());
		// this.service.setSelectedCities(this.calculateCitiesNights(this.selectedCities));
		this.service.setCurrentTabIndex(1);
	}

	goBack(): void {
		this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
	}

	updateCitiesPaths() {
		this.cityPaths = this.getSelectedCities()
			.map(city => {
				return { lat: Number(city.coordinates.split(', ')[0]), lng: Number(city.coordinates.split(', ')[1]) };
			});
		const travelingFromCoordinates = this.service.travelingFromCoordinates;
		this.cityPaths.unshift(travelingFromCoordinates);
		this.cityPaths.push(travelingFromCoordinates);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
