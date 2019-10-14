import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserPlansComponent } from './user-plans/user-plans.component';

const routes: Routes = [
	{
		path: '',
		component: UserComponent,
		// canActivate: [UserGuard],
		children: [
			{ path: 'plans', component: UserPlansComponent },
			{ path: '', component: UserInfoComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserRoutingModule { }
