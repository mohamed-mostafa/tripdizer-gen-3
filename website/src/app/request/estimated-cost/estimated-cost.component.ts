import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { EstimatedCostResponse } from './estimated-cost.model';

@Component({
	selector: 'c-request-estimated-cost',
	templateUrl: './estimated-cost.component.html',
	styleUrls: ['./estimated-cost.component.scss'],
})
export class EstimatedCostComponent {
	estimatedCost: EstimatedCostResponse;

	constructor(route: ActivatedRoute, private router: Router, private requestService: RequestService) {
		requestService.getEstimatedCost().subscribe((response: EstimatedCostResponse | null) => {
			if (response) {
				this.estimatedCost = response;
			} else {
				this.router.navigate(['../', this.requestService.getPrevInvalidStepForEstimateCalc(route.routeConfig.path)], {
					relativeTo: route,
				});
			}
		});
	}
}
