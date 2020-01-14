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
	hasCities: boolean;
	isFlightsTabVisited: boolean;
	isAccommodationTabVisited: boolean;
	currentTabIndex: Observable<boolean>;
	isLoading: boolean;
	tabIndex: number;

	constructor(
		private service: EstimatedCostService,
		private requestService: RequestService,
		private route: ActivatedRoute
	) {
		const tabIndexParam = this.route.snapshot.paramMap.get('tabIndex');
		this.selectedTab = this.tabIndex = tabIndexParam ? parseInt(tabIndexParam, 10) : 0;

		service.currentTabIndex.subscribe(n => {
			this.selectedTab = n;

			this.hasCities = service.citiesFlightsAccommodations.cities || n === 0 ? true : false;
			this.isFlightsTabVisited = this.isFlightsTabVisited || n === 1;
			this.isAccommodationTabVisited = this.isAccommodationTabVisited || n === 2;

			service.isFlightsTabVisited = this.isFlightsTabVisited;
			service.isAccommodationTabVisited = this.isAccommodationTabVisited;
		});

		this.requestService.isLoading.subscribe(isLoadingObject => {
			this.isLoading = isLoadingObject.show;
		});
	}

	tabChange(e) {
		this.service.setCurrentTabIndex(e);
	}
}
