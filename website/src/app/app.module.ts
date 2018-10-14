import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Modules */
import { AppRoutingModule } from './app-routing.module';

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
    MatMomentDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTokenInterceptor, multi: true },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
