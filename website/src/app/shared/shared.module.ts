import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

/* Components */
import { DialogComponent } from './components/dialog/dialog.component';
import { OwlCarouselComponent } from './components/owl-carousel/owl-carousel.component';

/* Pipes */
import { ErrorMessagePipe } from './pipes/error-message.pipe';

@NgModule({
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatInputModule, TranslateModule],
	exports: [ErrorMessagePipe, TranslateModule, DialogComponent, OwlCarouselComponent],
	declarations: [ErrorMessagePipe, DialogComponent, OwlCarouselComponent],
	entryComponents: [DialogComponent],
})
export class SharedModule {}
