import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SectionLandingComponent } from './main-page/section-landing/section-landing.component';
import { SectionTestimonialsComponent } from './main-page/section-testimonials/section-testimonials.component';
import { SectionVideosComponent } from './main-page/section-videos/section-videos.component';
import { SectionWhyUsComponent } from './main-page/section-why-us/section-why-us.component';
import { OurTeamComponent } from './our-team/our-team.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

export const COMPONENTS = [
	HomeComponent,
	SectionLandingComponent,
	SectionVideosComponent,
	SectionWhyUsComponent,
	SectionTestimonialsComponent,
	OurTeamComponent,
];

@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forChild(routes)],
})
export class HomeRoutingModule {}
