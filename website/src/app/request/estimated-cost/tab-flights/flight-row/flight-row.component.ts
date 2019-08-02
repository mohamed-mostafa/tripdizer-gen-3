import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Flight, FlightOffer } from '../flight.model';

@Component({
	selector: 'c-estimated-cost-flight-row',
	templateUrl: './flight-row.component.html',
	styleUrls: ['./flight-row.component.scss'],
})
export class FlightRowComponent {
	@Input() flight: Flight;
	@Input() index: number;
	@Input() isEven: boolean;
	@Input() isFirst: boolean;
	@Input() isLast: boolean;

	@Output() offerChanged = new EventEmitter<FlightOffer>();

	get isAnyFlightOfferExists(): boolean {
		return Boolean(this.flight) && Boolean(this.flight.flightOffers.length);
	}

	selectedOfferChanged(flightOffer: FlightOffer): void {
		this.offerChanged.emit(flightOffer);
	}
}
