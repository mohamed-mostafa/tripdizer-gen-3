import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EstimatedCostResponse } from './estimated-cost.model';
import { EstimatedCostService } from './estimated-cost.service';
import { RequestService } from '../request.service';

@Component({
	selector: 'c-request-estimated-cost',
	templateUrl: './estimated-cost.component.html',
	styleUrls: ['./estimated-cost.component.scss'],
})
export class EstimatedCostComponent {
	estimatedCost: EstimatedCostResponse;
	selectedTab: number;
	isCitiesTabVisited: Observable<boolean>;
	isFlightsTabVisited: Observable<boolean>;
	isAccommodationTabVisited: Observable<boolean>;
	currentTabIndex: Observable<boolean>;

	constructor(private service: EstimatedCostService, private requestService: RequestService) {
		this.selectedTab = 0;
		service.currentTabIndex.subscribe(n => {
			this.selectedTab = n;
		});

		this.isCitiesTabVisited = requestService.isCitiesTabVisited;
		this.isFlightsTabVisited = requestService.isFlightsTabVisited;
		this.isAccommodationTabVisited = requestService.isAccommodationTabVisited;
	}

	tabChange(e) {
		this.service.setCurrentTabIndex(e);
	}
}
