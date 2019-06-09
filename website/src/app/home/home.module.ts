import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { COMPONENTS as HomeComponents, HomeRoutingModule } from './home-routing.module';
import { NavLinkComponent } from './main-page/section-why-us/nav-link/nav-link.component';
import { TabContentComponent } from './main-page/section-why-us/tab-content/tab-content.component';

@NgModule({
	imports: [CommonModule, HomeRoutingModule, SharedModule, CoreModule],
	declarations: [...HomeComponents, NavLinkComponent, TabContentComponent],
})
export class HomeModule {}
