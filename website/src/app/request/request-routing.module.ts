import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */

const routes: Routes = [
];

export const COMPONENTS = [
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
