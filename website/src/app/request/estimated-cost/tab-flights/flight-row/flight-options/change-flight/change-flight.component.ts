import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flight, FlightOffer } from '../../../flight.model';

@Component({
	selector: 'c-estimated-cost-change-flight',
	templateUrl: './change-flight.component.html',
	styleUrls: ['./change-flight.component.scss'],
})
export class ChangeFlightComponent implements OnInit {
	@Input() flight: Flight;
	@Input() selectedOffer: FlightOffer;

	@Output() offerChanged = new EventEmitter<FlightOffer>();

	ngOnInit() {
		this.selectOffer(this.getFirstFlightOfferIfExists());
	}

	getFirstFlightOfferIfExists(): FlightOffer {
		if (!this.flight || !this.flight.flightOffers || !this.flight.flightOffers.length) {
			return;
		}
		return this.flight.flightOffers[0];
	}

	selectOffer(offer: FlightOffer): void {
		this.selectedOffer = offer;
		this.offerChanged.emit(offer);
	}
}
