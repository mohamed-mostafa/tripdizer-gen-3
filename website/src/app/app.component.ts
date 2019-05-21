import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TrackingService } from './shared/services/tracking.service';

@Component({
	selector: 'c-root',
	template: `
		<span [dir]="'dir' | translate" [class.rtl]="('dir' | translate) === 'rtl'">
			<router-outlet></router-outlet><c-core-social></c-core-social>
		</span>
	`,
})
export class AppComponent {
	constructor(router: Router, trackingService: TrackingService) {
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				trackingService.track(`Page view - ${event.urlAfterRedirects}`);
			}
		});
	}
}
