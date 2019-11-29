import { FlightOffer } from './../flight-offer.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'c-estimated-cost-flight-row',
	templateUrl: './flight-row.component.html',
	styleUrls: ['./flight-row.component.scss'],
})
export class FlightRowComponent {
	@Input() flightOffer: FlightOffer;
	@Input() index: number;
	@Input() isEven: boolean;
	@Input() isFirst: boolean;
	@Input() isLast: boolean;

	@Output() offerChanged = new EventEmitter<FlightOffer>();

	constructor() {
		console.log(this.flightOffer);
	}

	get isAnyFlightOfferExists(): boolean {
		return Boolean(this.flightOffer) && Boolean(this.flightOffer.flightLegs.length);
	}

	selectedOfferChanged(flightOffer: FlightOffer): void {
		this.offerChanged.emit(flightOffer);
	}
}
