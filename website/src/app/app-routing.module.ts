import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */

const routes: Routes = [
    { path: '', loadChildren: './home/home.module#HomeModule' }
];

export const COMPONENTS = [
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule { }
