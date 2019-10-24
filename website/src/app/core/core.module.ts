import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SocialComponent } from './social/social.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
	imports: [CommonModule, RouterModule, TranslateModule],
	exports: [NavBarComponent, SocialComponent, UserProfileComponent],
	declarations: [NavBarComponent, NotFoundComponent, SocialComponent, UserProfileComponent],
})
export class CoreModule {}
