import { Station } from './station.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { EstimatedCostService } from '../estimated-cost/estimated-cost.service';


@Injectable({ providedIn: 'root' })
export class SummaryService {

	stations: BehaviorSubject<Station[]>;
	totalCost: BehaviorSubject<{ hotels: number, flights: number }>;

	constructor(
		public estimatedCostService: EstimatedCostService,
	) {
		this.stations = new BehaviorSubject(this.estimatedCostService.getSummaryStations());
		this.stations.subscribe(results => console.log(results));
		this.totalCost = new BehaviorSubject(this.estimatedCostService.summaryTotalCost);
		this.estimatedCostService.selectedHotels.subscribe(() => {
			this.stations.next(this.estimatedCostService.getSummaryStations());
			console.log(this.estimatedCostService.getSummaryStations());
			this.totalCost.next(this.estimatedCostService.summaryTotalCost);
		});
	}

}
