import { OwlModule } from 'ngx-owl-carousel';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { COMPONENTS as HomeComponents, HomeRoutingModule } from './home-routing.module';

@NgModule({
	imports: [CommonModule, HomeRoutingModule, SharedModule, CoreModule, OwlModule],
	declarations: [...HomeComponents],
})
export class HomeModule {}
