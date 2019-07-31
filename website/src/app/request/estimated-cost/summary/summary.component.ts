import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../request.service';
// import * as moment from 'moment';
import { EstimatedCostService } from '../estimated-cost.service';
import { Station } from './station.model';
// import { CityDTO } from '../tab-cities/city-dto.model';
// import { FlightOffer } from '../tab-flights/flight.model';

@Component({
	selector: 'c-app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
	currentStepPath: string;
	stations: Array<Station> = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private service: EstimatedCostService,
		private requestService: RequestService
	) {
		this.currentStepPath = this.route.routeConfig.path;
		this.stations = service.getSummaryStations();
	}

	prev() {
		this.service.setCurrentTabIndex(0);
	}

	goToNextStep() {
		this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
	}
}
