import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { Destination } from './destination.model';

@Component({
  selector: 'c-request-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss']
})
export class DestinationsComponent {
  currentStepPath: string;
  destinations: Array<Destination>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService
  ) {
    this.currentStepPath = this.route.routeConfig.path;
    requestService.getDestinations().subscribe((response: Array<Destination>) => this.destinations = response);
    requestService.stepVisited(this.currentStepPath);
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
