import { TranslateService } from '@ngx-translate/core';

export class DynamicLocaleId extends String {
	constructor(private service: TranslateService) {
		super();
	}

	toString() {
		return this.service.currentLang;
	}
}
