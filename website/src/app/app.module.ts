import { CurrencyPipe } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppTranslateLoader, LangChangeEvent, TranslateLoader, TranslateModule, TranslateService } from './app-translate.loader';

/* Interceptors */
import { JWTokenInterceptor } from './http.interceptor';

/* Date Formats */
import { CUSTOM_FORMATS } from './shared/utils';

/* Components */
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: AppTranslateLoader,
        deps: [HttpClient]
      }
    }),
    CoreModule,
    MatMomentDateModule,
    MatSliderModule
  ],
  providers: [
    CurrencyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: JWTokenInterceptor, multi: true },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS }
  ],
  bootstrap: [AppComponent]
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
