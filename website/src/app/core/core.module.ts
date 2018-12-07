import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/* Components */
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SocialComponent } from './social/social.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
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
