import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { PathResolveService } from './core/not-found/path-resolve.service';

const routes: Routes = [
	{ path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
    { path: 'request', loadChildren: () => import('./request/request.module').then(m => m.RequestModule) },
	{ path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
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
