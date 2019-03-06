import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
export { TranslateLoader };

export class AppTranslateLoader implements TranslateLoader {
	constructor(private http: HttpClient) {}

	public getTranslation(lang: string): Observable<any> {
		return this.http.get(`./assets/i18n/${lang}.json`, { headers: { localUrl: 'true' } });
	}
}
