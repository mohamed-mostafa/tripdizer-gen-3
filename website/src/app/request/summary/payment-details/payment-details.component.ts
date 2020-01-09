import { Station } from './../station.model';
import { SummaryService } from './../summary.service';
import { Component } from '@angular/core';

@Component({
	selector: 'c-payment-details',
	templateUrl: './payment-details.component.html',
	styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent {
	stations: Station[];
	totalCost: { hotels: number; flights: number };

	constructor(public summaryService: SummaryService) {
		this.stations = this.summaryService.getSummaryStations() || null;
		this.totalCost = this.summaryService.getTotalCost() || null;
	}
}
