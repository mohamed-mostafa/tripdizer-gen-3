import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SocialComponent } from './social/social.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
	imports: [CommonModule, RouterModule, TranslateModule],
	exports: [FooterComponent, NavBarComponent, SocialComponent, UserProfileComponent],
	declarations: [FooterComponent, NavBarComponent, NotFoundComponent, SocialComponent, UserProfileComponent],
})
export class CoreModule {}
