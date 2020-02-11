import { AuthService } from './../../shared/services/auth.service';
import { SideNavService } from './../side-nav.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'c-app-side-menu',
	templateUrl: './side-menu.component.html',
	styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
	constructor(public nav: SideNavService, private authService: AuthService, private router: Router) {}

	ngOnInit() {}

	closeNav() {
		this.nav.closeNav();
	}

	logOut() {
		this.authService.signOut();
		this.router.navigate(['/']);
	}
}
