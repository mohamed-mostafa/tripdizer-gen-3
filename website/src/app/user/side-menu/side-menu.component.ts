import { AuthService } from './../../shared/services/auth.service';
import { SideNavService } from './../side-nav.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'c-app-side-menu',
	templateUrl: './side-menu.component.html',
	styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
	constructor(private sideNavService: SideNavService, private authService: AuthService, private router: Router) {}

	closeNav() {
		this.sideNavService.closeNav();
	}

	logOut() {
		this.authService.signOut();
		this.router.navigate(['/']);
	}
}
