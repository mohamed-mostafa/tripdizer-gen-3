import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as mixpanel from 'mixpanel-browser';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MixpanelService {
	projectToken = environment.mixpanelToken;

	constructor(private translate: TranslateService) {
		this.init();
	}

	init(): void {
		mixpanel.init(this.projectToken);
		mixpanel.register({ language: this.translate.currentLang });
	}

	track(id: string, data: any = {}): void {
		mixpanel.track(id, data);
	}
}
