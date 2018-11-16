import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

/* Components */
import { DialogComponent } from './components/dialog/dialog.component';
import { TestimonialsCarouselComponent } from './components/testimonials-carousel/testimonials-carousel.component';
import { VideosCarouselComponent } from './components/videos-carousel/videos-carousel.component';
import { SocialComponent } from './components/social/social.component';

/* Pipes */
import { ErrorMessagePipe } from './pipes/error-message.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule
  ],
  exports: [
    ErrorMessagePipe,
    DialogComponent,
    TestimonialsCarouselComponent,
    VideosCarouselComponent,
    SocialComponent
  ],
  declarations: [
    ErrorMessagePipe,
    DialogComponent,
    TestimonialsCarouselComponent,
    VideosCarouselComponent,
    SocialComponent
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class SharedModule { }
