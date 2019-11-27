import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget/budget.component';
import { DepartureReturnComponent } from './departure-return/departure-return.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { EstimatedCostComponent } from './estimated-cost/estimated-cost.component';
import { InformationComponent } from './information/information.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PurposeComponent } from './purpose/purpose.component';
import { RecommendedDestinationsComponent } from './recommended-destinations/recommended-destinations.component';
import { RequestComponent } from './request.component';
import { RequestGuard } from './request.guard';
import { BookingStepsComponent } from './summary/booking-steps/booking-steps.component';
import { BookingPaymentStepComponent } from './summary/booking-steps/payment-step/payment-step.component';
import { TravellerInfoComponent } from './summary/booking-steps/travellers-info-step/traveller-info/traveller-info.component';
import { BookingTravellersInfoComponent } from './summary/booking-steps/travellers-info-step/travellers-info-step.component';
import { SummaryComponent } from './summary/summary.component';
import { TicketComponent } from './ticket/ticket.component';
import { TravelAssistanceComponent } from './travel-assistance/travel-assistance.component';
import { TravelInfoComponent } from './travel-info/travel-info.component';
import { TravelersComponent } from './travelers/travelers.component';
import { TravelingFromComponent } from './traveling-from/traveling-from.component';

const routes: Routes = [
	{
		path: '',
		component: RequestComponent,
		canActivate: [RequestGuard],
		children: [
			{ path: '', redirectTo: 'travel-info', pathMatch: 'full' },
			{ path: 'travel-info', component: TravelInfoComponent },
			{ path: 'travel-info/:destinationName', component: TravelInfoComponent },
			{ path: 'traveling-from', component: TravelingFromComponent },
			{ path: 'traveling-to', component: DestinationsComponent },
			{ path: 'departure-return', component: DepartureReturnComponent },
			{ path: 'travelers', component: TravelersComponent },
			{ path: 'budget', component: BudgetComponent },
			{ path: 'purpose', component: PurposeComponent },
			{ path: 'preferences', component: PreferencesComponent },
			{ path: 'destinations', component: RecommendedDestinationsComponent },
			{ path: 'estimated-cost', component: EstimatedCostComponent },
			{ path: 'summary', component: SummaryComponent },
			{ path: 'booking', component: BookingStepsComponent },
			{ path: 'travel-assistance', component: TravelAssistanceComponent },
			{ path: 'information', component: InformationComponent },
			{ path: 'ticket', component: TicketComponent },
		],
	},
];

export const COMPONENTS = [
	TravelingFromComponent,
	DestinationsComponent,
	DepartureReturnComponent,
	TravelersComponent,
	BudgetComponent,
	PurposeComponent,
	PreferencesComponent,
	RecommendedDestinationsComponent,
	EstimatedCostComponent,
	SummaryComponent,
	TravelAssistanceComponent,
	InformationComponent,
	TicketComponent,
	TravelInfoComponent,
	TravellerInfoComponent,
	BookingTravellersInfoComponent,
	BookingPaymentStepComponent,
];

@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forChild(routes)],
})
export class RequestRoutingModule {}
