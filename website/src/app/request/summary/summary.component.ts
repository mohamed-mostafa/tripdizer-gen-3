import { SummaryService } from './summary.service';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Station } from './station.model';
import { EstimatedCostService } from '../estimated-cost/estimated-cost.service';
import { RequestService } from '../request.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnDestroy {
	currentStepPath: string;
	stations: Array<Station> = [];
	loadedData: boolean;
	private subscriptions = new Subscription();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		service: SummaryService,
		private estimatedCostService: EstimatedCostService,
		private requestService: RequestService
	) {
		this.currentStepPath = this.route.routeConfig.path;

		this.subscriptions.add(
			service.stations.subscribe(stations => {
				this.stations = stations ? stations : null;
				console.log(this.stations);
			})
		);
	}

	prev() {
		this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
	}

	goToNextStep() {
		this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
		this.requestService.resetSessionTimer();
	}

	goBack() {
		this.estimatedCostService.setCurrentTabIndex(2);
		this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
		
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}


}
