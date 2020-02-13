import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthService } from './../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	constructor(private auth: AuthService) {}

	canActivate() {
		return !!this.auth.isAuthenticated;
	}
}
