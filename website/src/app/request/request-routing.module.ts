import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { DepartureReturnComponent } from './departure-return/departure-return.component';
import { RequestNavBarComponent } from './nav-bar/nav-bar.component';
import { RequestComponent } from './request.component';
import { TravelersComponent } from './travelers/travelers.component';
import { TravelingFromComponent } from './traveling-from/traveling-from.component';
import { BudgetComponent } from './budget/budget.component';

const routes: Routes = [
    {
        path: '', component: RequestComponent,
        children: [
            { path: '', redirectTo: 'traveling-from', pathMatch: 'full' },
            { path: 'traveling-from', component: TravelingFromComponent },
            { path: 'departure-return', component: DepartureReturnComponent },
            { path: 'travelers', component: TravelersComponent },
            { path: 'budget', component: BudgetComponent },
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
