import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Modules */
import { COMPONENTS as HomeComponents, HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

/* Components */
import { NavLinkComponent } from './section-why-us/nav-link/nav-link.component';
import { TabContentComponent } from './section-why-us/tab-content/tab-content.component';

@NgModule({
	imports: [CommonModule, HomeRoutingModule, SharedModule, CoreModule],
	declarations: [...HomeComponents, NavLinkComponent, TabContentComponent],
})
export class HomeModule {}
