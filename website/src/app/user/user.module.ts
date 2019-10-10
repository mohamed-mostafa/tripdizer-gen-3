import { MatInputModule } from '@angular/material/input';
import { SharedModule } from './../shared/shared.module';
import { CoreModule } from './../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SideBarComponent } from './core/side-bar/side-bar.component';

@NgModule({
	declarations: [
		UserComponent,
		UserInfoComponent,
		SideBarComponent
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
	]
})
export class UserModule { }
