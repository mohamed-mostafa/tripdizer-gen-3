import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { HomeComponent } from './home.component';
import { SectionLandingComponent } from './section-landing/section-landing.component';
import { SectionVideosComponent } from './section-videos/section-videos.component';
import { SectionWhyUsComponent } from './section-why-us/section-why-us.component';
import { SectionOurTeamComponent } from './section-our-team/section-our-team.component';
import { SectionTestimonialsComponent } from './section-testimonials/section-testimonials.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

export const COMPONENTS = [
	HomeComponent,
	SectionLandingComponent,
	SectionVideosComponent,
	SectionWhyUsComponent,
	SectionOurTeamComponent,
	SectionTestimonialsComponent,
];

@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forChild(routes)],
})
export class HomeRoutingModule {}
