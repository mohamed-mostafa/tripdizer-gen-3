import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* Modules */
import { AppRoutingModule, COMPONENTS as AppComponents } from './app-routing.module';

/* Interceptors */
import { JWTokenInterceptor } from './http.interceptor';

/* Components */
import { HomeComponent } from './home/home.component';
import { SectionLandingComponent } from './home/section-landing/section-landing.component';
import { NavBarComponent } from './home/section-landing/nav-bar/nav-bar.component';
import { SectionVideosComponent } from './home/section-videos/section-videos.component';
import { VideosCarouselComponent } from './shared/components/videos-carousel/videos-carousel.component';
import { SectionOurTeamComponent } from './home/section-our-team/section-our-team.component';
import { SectionTestimonialsComponent } from './home/section-testimonials/section-testimonials.component';
import { TestimonialsCarouselComponent } from './shared/components/testimonials-carousel/testimonials-carousel.component';
import { FooterComponent } from './home/footer/footer.component';

@NgModule({
  declarations: [
    ...AppComponents,
    HomeComponent,
    SectionLandingComponent,
    NavBarComponent,
    SectionVideosComponent,
    VideosCarouselComponent,
    SectionOurTeamComponent,
    SectionTestimonialsComponent,
    TestimonialsCarouselComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTokenInterceptor, multi: true }
  ],
  bootstrap: [HomeComponent]
})
export class AppModule { }
