import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { CoreModule } from '../core/core.module';
import { DialogComponent } from './components/dialog/dialog.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { OwlCarouselComponent } from './components/owl-carousel/owl-carousel.component';
import { PlacesSelectBoxComponent } from './components/places-select-box/places-select-box.component';
import { ErrorMessagePipe } from './pipes/error-message.pipe';

@NgModule({
	imports: [
		AgmCoreModule.forRoot({ apiKey: environment.google.apiKey }),
		CommonModule,
		CoreModule,
		FormsModule,
		MatAutocompleteModule,
		MatChipsModule,
		MatDialogModule,
		MatInputModule,
		ReactiveFormsModule,
		TranslateModule,
	],
	exports: [
		DialogComponent,
		ErrorMessagePipe,
		GoogleMapComponent,
		LoginDialogComponent,
		OwlCarouselComponent,
		PlacesSelectBoxComponent,
		TranslateModule,
	],
	declarations: [
		DialogComponent,
		ErrorMessagePipe,
		GoogleMapComponent,
		LoginDialogComponent,
		OwlCarouselComponent,
		PlacesSelectBoxComponent,
	],
	entryComponents: [DialogComponent, LoginDialogComponent],
})
export class SharedModule {}
