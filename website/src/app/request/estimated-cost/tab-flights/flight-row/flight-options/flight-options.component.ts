import { FlightOffer } from './../../flight-offer.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'c-estimated-cost-flight-row-options',
	templateUrl: './flight-options.component.html',
	styleUrls: ['./flight-options.component.scss'],
})
export class FlightOptionsComponent {
	@Input() flightOffers: FlightOffer;

	@Output() offerChanged = new EventEmitter<FlightOffer>();

	selectedOffer: FlightOffer;

	selectedOfferChanged(flightOffer: FlightOffer): void {
		this.selectedOffer = flightOffer;
		this.offerChanged.emit(flightOffer);
	}
}
