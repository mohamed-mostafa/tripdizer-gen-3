import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flight, FlightOffer } from '../../flight.model';

@Component({
	selector: 'c-estimated-cost-flight-row-options',
	templateUrl: './flight-options.component.html',
	styleUrls: ['./flight-options.component.scss'],
})
export class FlightOptionsComponent implements OnInit {
	@Input() flight: Flight;

	@Output() offerChanged = new EventEmitter<FlightOffer>();

	selectedOffer: FlightOffer;

	ngOnInit() {
		this.selectedOffer = this.getFirstFlightOfferIfExists();
		this.offerChanged.emit(this.selectedOffer);
	}

	getFirstFlightOfferIfExists(): FlightOffer {
		if (!this.flight || !this.flight.flightOffers || !this.flight.flightOffers.length) {
			return;
		}
		return this.flight.flightOffers[0];
	}

	selectedOfferChanged(): void {
		this.offerChanged.emit(this.selectedOffer);
	}
}
