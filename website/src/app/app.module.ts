import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* Modules */
import { AppRoutingModule, COMPONENTS as AppComponents } from './app-routing.module';

/* Interceptors */
import { JWTokenInterceptor } from './http.interceptor';

/* Components */
import { HomeComponent } from './home/home.component';
import { SectionLandingComponent } from './home/section-landing/section-landing.component';
import { NavBarComponent } from './home/section-landing/nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    ...AppComponents,
    HomeComponent,
    SectionLandingComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTokenInterceptor, multi: true }
  ],
  bootstrap: [HomeComponent]
})
export class AppModule { }
