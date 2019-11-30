import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
	MatMomentDateModule,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
	MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import localeAr from '../assets/i18n/ar-EG';
import localeEn from '../assets/i18n/en-EG';
import { AppRoutingModule } from './app-routing.module';
import {
	AppTranslateLoader,
	LangChangeEvent,
	TranslateLoader,
	TranslateModule,
	TranslateService,
} from './app-translate.loader';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { JWTokenInterceptor } from './http.interceptor';
import { SocialAuthServiceConfig } from './shared/services/auth.service';
import { CUSTOM_DATE_FORMATS, CUSTOM_LOCALE_FORMATS } from './shared/utils';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeAr, 'ar');

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: AppTranslateLoader,
				deps: [HttpClient],
			},
		}),
		CoreModule,
		MatMomentDateModule,
		MatSliderModule,
		MatSnackBarModule,
		MatDialogModule,
		SocialLoginModule,
	],
	providers: [
		CurrencyPipe,
		{ provide: LOCALE_ID, useClass: CUSTOM_LOCALE_FORMATS, deps: [TranslateService] },
		{ provide: HTTP_INTERCEPTORS, useClass: JWTokenInterceptor, multi: true },
		{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
		{ provide: DateAdapter, useClass: MomentDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
		{ provide: AuthServiceConfig, useFactory: SocialAuthServiceConfig },
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(translate: TranslateService) {
		const defaultLang = translate.getBrowserLang() || 'en';
		translate.addLangs(['en', 'ar']);
		translate.setDefaultLang(defaultLang);
		translate.use(localStorage.getItem('localization-lang') || defaultLang);
		translate.onLangChange.subscribe((event: LangChangeEvent) => {
			localStorage.setItem('localization-lang', event.lang);
		});
	}
}
