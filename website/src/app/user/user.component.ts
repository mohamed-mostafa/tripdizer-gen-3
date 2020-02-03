import { User } from './user.model';
import { AuthService } from './../shared/services/auth.service';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
	selector: 'c-app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss'],
})
export class UserComponent {
	@ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
	user: User;

	constructor(private authService: AuthService) {
		this.authService.authenticatedUser.subscribe(user => (this.user = user));
	}

	closeNav() {
		this.sidenav.close();
	}

	openNav() {
		this.sidenav.open();
	}
}
