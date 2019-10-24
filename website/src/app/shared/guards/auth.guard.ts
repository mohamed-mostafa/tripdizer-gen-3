import { AuthService } from './../services/auth.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

	isAuthenticated: boolean;

	constructor(
		private auth: AuthService,
		private router: Router,
	) {
		this.auth.isAuthenticated.subscribe(res => {
			this.isAuthenticated = res;
		});
	}

	canActivate() {
		if (this.isAuthenticated) { return true; }
		this.router.navigate(['/']);
		return false;
	}

}
