import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './../shared/services/auth.service';
import { SideNavService } from './side-nav.service';
import { User } from './user.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnDestroy {
	@ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
	user: User;
	navContent: string;
	subUser: Subscription;
	subNavContent: Subscription;

	constructor(private authService: AuthService, private sideNavService: SideNavService) {
		this.subUser = this.authService.authenticatedUser.subscribe(user => (this.user = user));

		this.subNavContent = this.sideNavService.navContent.subscribe(navContentResult => {
			if (navContentResult && navContentResult.page) {
				this.navContent = navContentResult.page;
				this.openNav();
			} else {
				this.closeNav();
			}
		});
	}

	openNavPage(page) {
		this.sideNavService.openNav(page);
	}

	closeNav() {
		if (this.sidenav && this.sidenav.opened) {
			this.sidenav.close();
		}
	}

	openNav() {
		if (this.sidenav && this.sidenav.opened) {
			this.closeNav();
			this.sidenav.open();
		} else if (this.sidenav) {
			this.sidenav.open();
		}
	}

	ngOnDestroy() {
		this.subUser.unsubscribe();
		this.subNavContent.unsubscribe();
	}
}
