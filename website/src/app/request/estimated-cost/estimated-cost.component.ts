import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
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
	isCitiesTabVisited: Observable<boolean>;
	isFlightsTabVisited: Observable<boolean>;
	isAccommodationTabVisited: Observable<boolean>;
	currentTabIndex: Observable<boolean>;
	isLoading: boolean;
	tabIndex: number;

	constructor(
		private service: EstimatedCostService,
		private requestService: RequestService,
		private route: ActivatedRoute
	) {
		const tabIndexParam = this.route.snapshot.paramMap.get('tabIndex');
		console.log(tabIndexParam);
		this.tabIndex = tabIndexParam ? parseInt(tabIndexParam, 10) : 0;
		console.log(this.tabIndex);

		service.currentTabIndex.subscribe(n => {
			this.selectedTab = n;
			console.log(this.selectedTab);
			console.log(n);
		});

		this.isCitiesTabVisited = requestService.isCitiesTabVisited;
		this.isFlightsTabVisited = requestService.isFlightsTabVisited;
		this.isAccommodationTabVisited = requestService.isAccommodationTabVisited;
		this.requestService.isLoading.subscribe(isLoadingObject => {
			this.isLoading = isLoadingObject.show;
		});
	}

	tabChange(e) {
		this.service.setCurrentTabIndex(e);
	}
}
