import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Components */
import { VideosCarouselComponent } from './components/videos-carousel/videos-carousel.component';
import { TestimonialsCarouselComponent } from './components/testimonials-carousel/testimonials-carousel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    VideosCarouselComponent,
    TestimonialsCarouselComponent
  ],
  declarations: [
    VideosCarouselComponent,
    TestimonialsCarouselComponent
  ]
})
export class SharedModule { }
