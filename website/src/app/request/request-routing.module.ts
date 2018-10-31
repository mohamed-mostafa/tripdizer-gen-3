import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { BudgetComponent } from './budget/budget.component';
import { DepartureReturnComponent } from './departure-return/departure-return.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { EstimatedCostComponent } from './estimated-cost/estimated-cost.component';
import { InformationComponent } from './information/information.component';
import { RequestNavBarComponent } from './nav-bar/nav-bar.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PurposeComponent } from './purpose/purpose.component';
import { RecommendedDestinationsComponent } from './recommended-destinations/recommended-destinations.component';
import { RequestComponent } from './request.component';
import { TravelAssistanceComponent } from './travel-assistance/travel-assistance.component';
import { TravelersComponent } from './travelers/travelers.component';
import { TravelingFromComponent } from './traveling-from/traveling-from.component';

const routes: Routes = [
    {
        path: '', component: RequestComponent,
        children: [
            { path: '', redirectTo: 'traveling-from', pathMatch: 'full' },
            { path: 'traveling-from', component: TravelingFromComponent },
            { path: 'traveling-to', component: DestinationsComponent },
            { path: 'departure-return', component: DepartureReturnComponent },
            { path: 'travelers', component: TravelersComponent },
            { path: 'budget', component: BudgetComponent },
            { path: 'purpose', component: PurposeComponent },
            { path: 'preferences', component: PreferencesComponent },
            { path: 'destinations', component: RecommendedDestinationsComponent },
            { path: 'estimated-cost', component: EstimatedCostComponent },
            { path: 'travel-assistance', component: TravelAssistanceComponent },
            { path: 'information', component: InformationComponent }
        ]
    }
];

export const COMPONENTS = [
    RequestComponent,
    RequestNavBarComponent,
    TravelingFromComponent,
    DestinationsComponent,
    DepartureReturnComponent,
    TravelersComponent,
    BudgetComponent,
    PurposeComponent,
    PreferencesComponent,
    RecommendedDestinationsComponent,
    EstimatedCostComponent,
    TravelAssistanceComponent,
    InformationComponent
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class RequestRoutingModule { }
