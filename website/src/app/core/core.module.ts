import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Components */
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    NavBarComponent,
    FooterComponent
  ],
  declarations: [
    NavBarComponent,
    FooterComponent
  ]
})
export class CoreModule { }
