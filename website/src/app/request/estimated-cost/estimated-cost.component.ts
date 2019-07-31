import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EstimatedCostResponse } from './estimated-cost.model';
import { EstimatedCostService } from './estimated-cost.service';

@Component({
	selector: 'c-request-estimated-cost',
	templateUrl: './estimated-cost.component.html',
	styleUrls: ['./estimated-cost.component.scss'],
})
export class EstimatedCostComponent {
	estimatedCost: EstimatedCostResponse;
	selectedTab: number;
	isFlightsTabVisited: Observable<boolean>;

	constructor( private service: EstimatedCostService) {
		service.currentTabIndex.subscribe(n => (this.selectedTab = n));
		this.isFlightsTabVisited = service.isFlightsTabVisited;
	}

	tabChange(e) {
		this.service.setCurrentTabIndex(e);
	}
}
