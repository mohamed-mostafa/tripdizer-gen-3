import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RequestService } from '../request.service';
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

	constructor(route: ActivatedRoute, private service: EstimatedCostService) {
		service.currentTabIndex.subscribe(n => (this.selectedTab = n));
		this.isFlightsTabVisited = service.isFlightsTabVisited;
	}

	tabChange(e) {
		this.service.setCurrentTabIndex(e);
	}
}
