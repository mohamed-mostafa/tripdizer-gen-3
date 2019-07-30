import { Station } from './station.model';
import { Component } from '@angular/core';
// import * as moment from 'moment';
import { EstimatedCostService } from '../estimated-cost.service';
import { CityAttractions, Attraction } from './attraction.model';
// import { CityDTO } from '../tab-cities/city-dto.model';
// import { FlightOffer } from '../tab-flights/flight.model';

@Component({
	selector: 'c-app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

	stations: Array<Station> = [];

	constructor(private service: EstimatedCostService) {
		this.stations = service.getSummaryStations();
		console.log(this.stations);
	}


	prev() {
		this.service.setCurrentTabIndex(0);
	}

	next() {

	}

}
