import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { UserBookingComponent } from './user-booking/user-booking.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { PlanDetailsComponent } from './user-plans/plan-details/plan-details.component';
import { UserPlansComponent } from './user-plans/user-plans.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
	declarations: [
		UserComponent,
		UserInfoComponent,
		SideBarComponent,
		UserPlansComponent,
		UserBookingComponent,
		SideMenuComponent,
		PlanDetailsComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		UserRoutingModule,
		MatToolbarModule,
		MatSidenavModule,
		TranslateModule,
		MatListModule,
		MatInputModule,
	],
})
export class UserModule {}
