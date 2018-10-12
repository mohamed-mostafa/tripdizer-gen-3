import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { RequestComponent } from './request.component';
import { RequestNavBarComponent } from './nav-bar/nav-bar.component';
import { TravelingFromComponent } from './traveling-from/traveling-from.component';

const routes: Routes = [
    {
        path: '', component: RequestComponent,
        children: [
            { path: '', redirectTo: 'traveling-from', pathMatch: 'full' },
            { path: 'traveling-from', component: TravelingFromComponent }
        ]
    }
];

export const COMPONENTS = [
    RequestComponent,
    RequestNavBarComponent,
    TravelingFromComponent
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
