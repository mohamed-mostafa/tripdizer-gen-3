import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Station } from './station.model';
import { EstimatedCostService } from '../estimated-cost/estimated-cost.service';
import { RequestService } from '../request.service';

@Component({
	selector: 'c-app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {

	currentStepPath: string;
	stations: Array<Station> = [];
	loadedData: boolean;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private service: EstimatedCostService,
		private requestService: RequestService
	) {
		this.currentStepPath = this.route.routeConfig.path;
		this.stations = service.getSummaryStations();
		service.finishGetAttractions.subscribe(x => {
			this.loadedData = x;
		});
	}

	prev() {
		this.service.setCurrentTabIndex(0);
	}

	goToNextStep() {
		this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
	}
}
