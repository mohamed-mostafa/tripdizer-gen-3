import { Component, Input } from '@angular/core';
import { EstimatedCostService } from '../../estimated-cost.service';
import { RequestService } from './../../../request.service';
import { CityDTO } from './../../tab-cities/city-dto.model';
import { FlightOffer } from './../flight-offer.model';

@Component({
	selector: 'c-app-flight-route',
	templateUrl: './flight-route.component.html',
	styleUrls: ['./flight-route.component.scss'],
})
export class FlightRouteComponent {
	@Input() flightOffers: FlightOffer;
	selectedCities: Array<CityDTO>;
	travelFrom: string;

	constructor(service: EstimatedCostService, requestService: RequestService) {
		this.selectedCities = service.getSelectedCities();
		this.travelFrom = requestService.getProperty('travelingFrom');
	}
}
