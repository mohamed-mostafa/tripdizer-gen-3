import { AuthService } from './../services/auth.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	isAuthenticated: boolean;

	constructor(private auth: AuthService) {
		this.isAuthenticated = this.auth.isAuthenticated.getValue();
	}

	canActivate() {
		if (this.isAuthenticated) {
			return true;
		}
		return false;
	}
}
