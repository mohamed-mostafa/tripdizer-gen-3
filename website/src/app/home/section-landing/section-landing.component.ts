import { Component } from '@angular/core';
import { MixpanelService } from 'src/app/shared/services/mixpanel.service';

@Component({
	selector: 'c-home-section-landing',
	templateUrl: './section-landing.component.html',
	styleUrls: ['./section-landing.component.scss'],
})
export class SectionLandingComponent {
	constructor(private mixpanelService: MixpanelService) {}

	havePlan() {
		this.mixpanelService.track('Submit - Yes, I have a plan');
	}

	surpriseMe() {
		this.mixpanelService.track('Submit - NO, Surprise me');
	}
}
