import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { EstimatedCostHeaderComponent } from './estimated-cost/header/header.component';
import { TabAccommodationComponent } from './estimated-cost/tab-accommodation/tab-accommodation.component';
import { TabCitiesComponent } from './estimated-cost/tab-cities/tab-cities.component';
import { ChangeFlightComponent } from './estimated-cost/tab-flights/flight-row/flight-options/change-flight/change-flight.component';
import { FlightOptionsComponent } from './estimated-cost/tab-flights/flight-row/flight-options/flight-options.component';
import { FlightRowComponent } from './estimated-cost/tab-flights/flight-row/flight-row.component';
import { TabFlightsComponent } from './estimated-cost/tab-flights/tab-flights.component';
import { RequestFormLayoutComponent } from './form-layout/form-layout.component';
import { RequestLoadingComponent } from './loading/loading.component';
import { RequestNavBarComponent } from './nav-bar/nav-bar.component';
import { COMPONENTS as RequestComponents, RequestRoutingModule } from './request-routing.module';
import { RequestComponent } from './request.component';
import { SummaryComponent } from './summary/summary.component';
import { SummaryModule } from './summary/summary.module';

@NgModule({
	imports: [
        CommonModule,
        SummaryModule,
		RequestRoutingModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatTabsModule,
		MatMenuModule,
	],
	declarations: [
		...RequestComponents,
		RequestComponent,
		RequestNavBarComponent,
		RequestFormLayoutComponent,
		RequestLoadingComponent,
		EstimatedCostHeaderComponent,
		TabCitiesComponent,
		TabFlightsComponent,
		FlightRowComponent,
		FlightOptionsComponent,
		ChangeFlightComponent,
		TabAccommodationComponent,
		SummaryComponent,
	]
})
export class RequestModule { }
