import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
	declarations: [
		UserComponent,
		UserInfoComponent
	],
	imports: [
		CommonModule,
		UserRoutingModule,
		MatToolbarModule,
		MatSidenavModule,
		TranslateModule
	]
})
export class UserModule { }
