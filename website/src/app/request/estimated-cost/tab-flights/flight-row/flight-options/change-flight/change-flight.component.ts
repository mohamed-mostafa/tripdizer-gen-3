import { FlightOffer, FlightLeg } from './../../../flight-offer.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'c-estimated-cost-change-flight',
	templateUrl: './change-flight.component.html',
	styleUrls: ['./change-flight.component.scss'],
})
export class ChangeFlightComponent implements OnInit {
	@Input() flightOffers: FlightOffer;
	@Input() selectedOffer: FlightOffer;

	@Output() offerChanged = new EventEmitter<FlightOffer>();

	ngOnInit() {
		// this.selectOffer(this.getFirstFlightOfferIfExists());
	}

	getFirstFlightOfferIfExists(): FlightLeg {
		if (!this.flightOffers || !this.flightOffers || !this.flightOffers.flightLegs.length) {
			return;
		}
		return this.flightOffers.flightLegs[0];
	}

	selectOffer(offer: FlightOffer): void {
		this.selectedOffer = offer;
		this.offerChanged.emit(offer);
	}

	menuClosed(): void {
		document.body.style.overflow = 'initial';
	}

	menuOpened(): void {
		if (document.body.clientWidth < 470) {
			document.body.style.overflow = 'hidden';
		}
	}
}
