import { Component, OnInit, Input } from '@angular/core';
import { EstimatedCostService } from '../../estimated-cost/estimated-cost.service';

@Component({
	selector: 'c-payment-details',
	templateUrl: './payment-details.component.html',
	styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {

	@Input() stations: any;
	totalCost: { hotels: number, flights: number };

	constructor(
		service: EstimatedCostService,
	) {
		this.totalCost = service.summaryTotalCost;
	}

	ngOnInit() {
	}

}
