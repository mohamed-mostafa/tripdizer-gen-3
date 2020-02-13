import { UserBookingComponent } from './user-booking/user-booking.component';
import { AuthGuard } from './../shared/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserPlansComponent } from './user-plans/user-plans.component';

const routes: Routes = [
	{
		path: '',
		component: UserComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: 'bookings', component: UserBookingComponent },
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
