import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { DepartureReturnComponent } from './departure-return/departure-return.component';
import { RequestNavBarComponent } from './nav-bar/nav-bar.component';
import { RequestComponent } from './request.component';
import { TravelersComponent } from './travelers/travelers.component';
import { TravelingFromComponent } from './traveling-from/traveling-from.component';
import { BudgetComponent } from './budget/budget.component';
import { PurposeComponent } from './purpose/purpose.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { EstimatedCostComponent } from './estimated-cost/estimated-cost.component';

const routes: Routes = [
    {
        path: '', component: RequestComponent,
        children: [
            { path: '', redirectTo: 'traveling-from', pathMatch: 'full' },
            { path: 'traveling-from', component: TravelingFromComponent },
            { path: 'departure-return', component: DepartureReturnComponent },
            { path: 'travelers', component: TravelersComponent },
            { path: 'budget', component: BudgetComponent },
            { path: 'purpose', component: PurposeComponent },
            { path: 'preferences', component: PreferencesComponent },
            { path: 'estimated-cost', component: EstimatedCostComponent },
        ]
    }
];

export const COMPONENTS = [
    RequestComponent,
    RequestNavBarComponent,
    TravelingFromComponent,
    DepartureReturnComponent,
    TravelersComponent,
    BudgetComponent,
    PurposeComponent,
    PreferencesComponent,
    EstimatedCostComponent,
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
