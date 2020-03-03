import { SummaryService } from './summary.service';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
		service: SummaryService,
		private estimatedCostService: EstimatedCostService,
		private requestService: RequestService
	) {
		this.currentStepPath = this.route.routeConfig.path;

		this.stations = service.getSummaryStations() || null;
	}

	modify() {
		this.estimatedCostService.tabsNavigate('summary', 'modify', this.currentStepPath, this.route);
	}

	goToNextStep() {
		this.requestService.setProperty('requiresPayment', false);
		this.estimatedCostService.tabsNavigate('summary', 'next', this.currentStepPath, this.route);
		this.requestService.resetSessionTimer();
	}

	goBack() {
		this.estimatedCostService.tabsNavigate('summary', 'back', this.currentStepPath, this.route);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
