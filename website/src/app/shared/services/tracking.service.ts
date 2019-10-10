import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as mixpanel from 'mixpanel-browser';
import { environment } from '../../../environments/environment';

declare const gtag: (event, id, data) => {};
declare const fbq: (event, id, data) => {};

@Injectable({ providedIn: 'root' })
export class TrackingService {
	projectToken = environment.mixpanelToken;
	experimentKey = environment.experimentKey;

	constructor(private translate: TranslateService) {
		this.init();
	}

	init(): void {
		mixpanel.init(this.projectToken);
		mixpanel.register({ language: this.translate.currentLang });
		if (this.experimentKey) {
			mixpanel.register({ experiment: this.experimentKey });
		}
	}

	track(id: string, data: any = {}): void {
		mixpanel.track(id, data);
		gtag('event', id, data);
		fbq('track', id, data);
	}

	trackConversion(): void {
		gtag('event', 'conversion', { send_to: environment.google.conversionTrackingTarget });
	}
}
