import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../core/core.module';
import { DialogComponent } from './components/dialog/dialog.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { OwlCarouselComponent } from './components/owl-carousel/owl-carousel.component';
import { ErrorMessagePipe } from './pipes/error-message.pipe';

@NgModule({
	imports: [
		CoreModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatInputModule,
		TranslateModule,
	],
	exports: [ErrorMessagePipe, TranslateModule, DialogComponent, LoginDialogComponent, OwlCarouselComponent],
	declarations: [ErrorMessagePipe, DialogComponent, LoginDialogComponent, OwlCarouselComponent],
	entryComponents: [DialogComponent, LoginDialogComponent],
})
export class SharedModule {}
