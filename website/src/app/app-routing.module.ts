import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { PathResolveService } from './core/not-found/path-resolve.service';

const routes: Routes = [
	{ path: '', loadChildren: './home/home.module#HomeModule' },
	{ path: 'request', loadChildren: './request/request.module#RequestModule' },
	{ path: 'user', loadChildren: './user/user.module#UserModule' },
	{
		path: '**',
		resolve: { path: PathResolveService },
		component: NotFoundComponent,
	},
];

@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
