import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { RecommendedDestinationsResponse } from './recommended-destination.model';

@Component({
  selector: 'c-request-recommended-destinations',
  templateUrl: './recommended-destinations.component.html',
  styleUrls: ['./recommended-destinations.component.scss']
})
export class RecommendedDestinationsComponent {
  currentStepPath: string;
  destinations: Array<RecommendedDestinationsResponse>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService
  ) {
    this.currentStepPath = this.route.routeConfig.path;
    requestService.getRecommendedDestinations().subscribe((response: Array<RecommendedDestinationsResponse> | null) => {
      if (response) {
        this.destinations = response;
      } else {
        this.router.navigate(['../', this.requestService.getPrevInvalidStepForRecommendedDestinations(this.currentStepPath)],
          { relativeTo: this.route });
      }
    });
  }

  save(destinationId: number): boolean {
    const selectedDestination = this.destinations.find(p => p.id === destinationId);
    if (selectedDestination) {
      this.requestService.setProperty('destination', selectedDestination.id);
      this.requestService.setProperty('destinationName', selectedDestination.name);
      return true;
    }
    return false;
  }

  goToPrevStep() {
    this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
  }

  goToNextStep(destinationId) {
    if (this.save(destinationId)) {
      this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
    }
  }

}
