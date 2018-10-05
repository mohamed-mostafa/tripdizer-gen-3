import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* Modules */
import { AppRoutingModule, COMPONENTS as AppComponents } from './app-routing.module';

/* Interceptors */
import { JWTokenInterceptor } from './http.interceptor';

/* Components */
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    ...AppComponents,
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
