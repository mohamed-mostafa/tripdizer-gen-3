import { Component } from '@angular/core';
import { TrackingService } from 'src/app/shared/services/tracking.service';

@Component({
	selector: 'c-home-section-landing',
	templateUrl: './section-landing.component.html',
	styleUrls: ['./section-landing.component.scss'],
})
export class SectionLandingComponent {
	constructor(private trackingService: TrackingService) {}

	havePlan() {
		this.trackingService.track('Submit - Yes, I have a plan');
	}

	surpriseMe() {
		this.trackingService.track('Submit - NO, Surprise me');
	}
}
