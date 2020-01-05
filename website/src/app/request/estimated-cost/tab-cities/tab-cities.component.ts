import { TranslateService } from '@ngx-translate/core';
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
	cityPaths: any = [];
	snackBar: MatSnackBar;
	private subscriptions = new Subscription();

	constructor(
		private service: EstimatedCostService,
		snackBar: MatSnackBar,
		private requestService: RequestService,
		private route: ActivatedRoute,
		private router: Router,
		public summaryService: SummaryService,
		public translate: TranslateService
	) {
		this.snackBar = snackBar;
		this.subscriptions.add(
			service.getCities().subscribe(citiesResult => {
				this.cities = citiesResult;
				this.updateCitiesPaths();
			})
		);
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
				this.subscriptions.add(
					this.translate
						.get('request.estimated_cost.tab_cities.too_many_cities_message', { numberOfNights })
						.subscribe((message: string) => {
							this.snackBar.open(message, this.translate.instant('request.estimated_cost.tab_cities.ok'), {
								duration: 3000,
							});
						})
				);
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

	updateCitiesPaths() {
		this.cityPaths = this.getSelectedCities().map(city => {
			return { lat: Number(city.coordinates.split(', ')[0]), lng: Number(city.coordinates.split(', ')[1]) };
		});
		const travelingFromCoordinates = this.service.travelingFromCoordinates;
		this.cityPaths.unshift(travelingFromCoordinates);
		this.cityPaths.push(travelingFromCoordinates);
	}

	goNext(): void {
		this.service.setCities(this.cities);
		this.service.setCurrentTabIndex(1);
		this.service.setCityPaths(this.cityPaths);
	}

	goBack(): void {
		this.service.setCities(this.cities);
		this.router.navigate(['../', this.requestService.getPrevStep(this.route.routeConfig.path)], {
			relativeTo: this.route,
		});
		this.service.setCityPaths(this.cityPaths);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
