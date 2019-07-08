import { Component, Input, OnInit } from '@angular/core';
import { Flight, FlightOffer } from '../../flight.model';

@Component({
	selector: 'c-estimated-cost-flight-row-options',
	templateUrl: './flight-options.component.html',
	styleUrls: ['./flight-options.component.scss'],
})
export class FlightOptionsComponent implements OnInit {
	@Input() flight: Flight;

	selectedOffer: FlightOffer;

	ngOnInit() {
		this.selectedOffer = this.getFirstFlightOfferIfExists();
	}

	getFirstFlightOfferIfExists(): FlightOffer {
		if (!this.flight || !this.flight.flightOffers || !this.flight.flightOffers.length) {
			return;
		}
		return this.flight.flightOffers[0];
	}
}
