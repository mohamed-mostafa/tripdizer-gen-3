import { ActivatedRoute, Router } from '@angular/router';
import { Station } from './station.model';
import { Component, EventEmitter, Output } from '@angular/core';
// import * as moment from 'moment';
import { EstimatedCostService } from '../estimated-cost.service';
import { CityAttractions, Attraction } from './attraction.model';
import { RequestService } from '../../request.service';
// import { CityDTO } from '../tab-cities/city-dto.model';
// import { FlightOffer } from '../tab-flights/flight.model';

@Component({
	selector: 'c-app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

	stations: Array<Station> = [];
	nextStepPath: string;
	@Output() next = new EventEmitter();

	constructor(
		private service: EstimatedCostService,
		requestService: RequestService,
		private route: ActivatedRoute,
		private router: Router,
		) {
		this.stations = service.getSummaryStations();
		console.log(this.stations);
		const currentStepPath = route.routeConfig.path;
		this.nextStepPath = requestService.getNextStep(currentStepPath);
		console.log(this.nextStepPath);
	}


	prev() {
		this.service.setCurrentTabIndex(0);
	}

	goToNextStep() {
		this.next.emit();
		this.router.navigate(['../', this.nextStepPath], { relativeTo: this.route });
	}

}
