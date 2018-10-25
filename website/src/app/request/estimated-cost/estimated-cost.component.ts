import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { EstimatedCostResponse } from './estimated-cost.model';

@Component({
  selector: 'c-request-estimated-cost',
  templateUrl: './estimated-cost.component.html',
  styleUrls: ['./estimated-cost.component.scss']
})
export class EstimatedCostComponent implements OnInit {
  currentStepPath: string;
  estimatedCost: EstimatedCostResponse = {
    flightsBudget: null,
    dailySpending: null,
    accommodationBudget: null,
    ferriesBudget: null,
    totalBudget: null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService
  ) {
    this.currentStepPath = this.route.routeConfig.path;
    requestService.getEstimatedCost().subscribe((response: EstimatedCostResponse | null) => {
      if (response) {
        this.estimatedCost = response;
      } else {
        this.router.navigate(['../', this.requestService.getPrevInvalidStepForEstimateCalc(this.currentStepPath)],
          { relativeTo: this.route });
      }
    });
    requestService.stepVisited(this.currentStepPath);
  }

  ngOnInit() {
  }

  goToPrevStep() {
    this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
  }

  goToNextStep() {
    this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
  }

}
