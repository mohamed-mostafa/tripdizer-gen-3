import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Components */
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SocialComponent } from './social/social.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    FooterComponent,
    NavBarComponent,
    SocialComponent
  ],
  declarations: [
    FooterComponent,
    NavBarComponent,
    SocialComponent
  ]
})
export class CoreModule { }
