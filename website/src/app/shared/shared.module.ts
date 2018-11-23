import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

/* Components */
import { DialogComponent } from './components/dialog/dialog.component';
import { TestimonialsCarouselComponent } from './components/testimonials-carousel/testimonials-carousel.component';
import { VideosCarouselComponent } from './components/videos-carousel/videos-carousel.component';

/* Pipes */
import { ErrorMessagePipe } from './pipes/error-message.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    TranslateModule
  ],
  exports: [
    ErrorMessagePipe,
    TranslateModule,
    DialogComponent,
    TestimonialsCarouselComponent,
    VideosCarouselComponent
  ],
  declarations: [
    ErrorMessagePipe,
    DialogComponent,
    TestimonialsCarouselComponent,
    VideosCarouselComponent
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class SharedModule { }
