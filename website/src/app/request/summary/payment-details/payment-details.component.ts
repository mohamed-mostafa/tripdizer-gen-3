import { Station } from './../station.model';
import { SummaryService } from './../summary.service';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-payment-details',
	templateUrl: './payment-details.component.html',
	styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnDestroy {

	stations: Station[];
	totalCost: { hotels: number, flights: number };
	private subscriptions = new Subscription();

	constructor(
		public summaryService: SummaryService,
	) {

		this.subscriptions.add(this.summaryService.stations
			.subscribe(stations => {
				this.stations = stations ? stations : null;
			})
		);

		this.subscriptions.add(this.summaryService.totalCost
			.subscribe(totalCost => {
				this.totalCost = totalCost ? totalCost : null;
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

}
