import { PaymentConfirmComponent } from './payment-confirm/payment-confirm.component';
import { SectionHowToComponent } from './main-page/section-how-to/section-how-to.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SectionLandingComponent } from './main-page/section-landing/section-landing.component';
import { SectionTestimonialsComponent } from './main-page/section-testimonials/section-testimonials.component';
import { SectionWhyUsComponent } from './main-page/section-why-us/section-why-us.component';
import { OurTeamComponent } from './our-team/our-team.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
            { path: '', component: MainPageComponent }, 
            { path: 'our-team', component: OurTeamComponent },
            { path: 'payment-confirm', component: PaymentConfirmComponent }
        ],
	},
];

export const COMPONENTS = [
	HomeComponent,
	MainPageComponent,
	SectionLandingComponent,
	SectionWhyUsComponent,
	SectionTestimonialsComponent,
	OurTeamComponent,
	SectionHowToComponent
];

@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forChild(routes)],
})
export class HomeRoutingModule { }
