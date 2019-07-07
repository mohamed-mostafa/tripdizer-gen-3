import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { CoreModule } from '../core/core.module';
import { DialogComponent } from './components/dialog/dialog.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
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
		AgmCoreModule.forRoot({ apiKey: environment.google.apiKey }),
	],
	exports: [
		ErrorMessagePipe,
		TranslateModule,
		DialogComponent,
		LoginDialogComponent,
		OwlCarouselComponent,
		GoogleMapComponent,
	],
	declarations: [ErrorMessagePipe, DialogComponent, LoginDialogComponent, OwlCarouselComponent, GoogleMapComponent],
	entryComponents: [DialogComponent, LoginDialogComponent],
})
export class SharedModule {}
