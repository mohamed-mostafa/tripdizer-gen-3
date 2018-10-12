import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { RequestComponent } from './request.component';
import { RequestNavBarComponent } from './nav-bar/nav-bar.component';

const routes: Routes = [
    {
        path: '', component: RequestComponent,
        children: [
            { path: '', redirectTo: 'first-step', pathMatch: 'full' }
        ]
    }
];

export const COMPONENTS = [
    RequestComponent,
    RequestNavBarComponent
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
