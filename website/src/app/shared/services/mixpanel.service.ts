import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MixpanelService {
	projectToken = environment.mixpanelToken;

	init(): void {
		mixpanel.init(this.projectToken);
	}

	track(id: string, data: any = {}): void {
		mixpanel.track(id, data);
	}
}
