import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingService } from '../../shared/services/tracking.service';
import { RequestService } from '../request.service';
import { RecommendedDestinationsResponse } from './recommended-destination.model';

@Component({
	selector: 'c-request-recommended-destinations',
	templateUrl: './recommended-destinations.component.html',
	styleUrls: ['./recommended-destinations.component.scss'],
})
export class RecommendedDestinationsComponent {
	currentStepPath: string;
	selectedDestination: RecommendedDestinationsResponse;
	destinations: Array<RecommendedDestinationsResponse>;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private requestService: RequestService,
		private trackingService: TrackingService
	) {
		this.currentStepPath = this.route.routeConfig.path;
		this.selectedDestination = requestService.getProperty('destination');
		requestService.getRecommendedDestinations().subscribe((response: Array<RecommendedDestinationsResponse> | null) => {
			if (response) {
				this.destinations = response;
			} else {
				this.router.navigate(
					['../', this.requestService.getPrevInvalidStepForRecommendedDestinations(this.currentStepPath)],
					{ relativeTo: this.route }
				);
			}
		});
	}

	save(destination: RecommendedDestinationsResponse): boolean {
		this.requestService.setProperty('destination', destination);
		this.trackingService.track('Submit - Recommended Destination', {
			destinationId: destination.id,
			destinationName: destination.name,
		});
		return true;
	}

	goToPrevStep() {
		this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
	}

	goToNextStep(destination: RecommendedDestinationsResponse) {
		if (this.save(destination)) {
			this.router.navigate(['../', this.requestService.getNextStep('summary')], { relativeTo: this.route });
		}
	}
}
