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
	currentTab: number;

	constructor(private service: EstimatedCostService) {
		service.currentTabIndex.subscribe(n => {
			this.selectedTab = n;
			console.log(this.selectedTab);
		});
		this.isFlightsTabVisited = service.isFlightsTabVisited;
	}

	tabChange(e) {
		this.service.setCurrentTabIndex(e);
	}
}
