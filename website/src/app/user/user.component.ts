import { SideNavService } from './side-nav.service';
import { User } from './user.model';
import { AuthService } from './../shared/services/auth.service';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnDestroy {
	@ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
	private subscriptions = new Subscription();
	user: User;
	navContent: string;

	constructor(private authService: AuthService, public nav: SideNavService) {
		this.authService.authenticatedUser.subscribe(user => (this.user = user));

		this.subscriptions.add(
			this.nav.navContent.subscribe(navContentResult => {
				if (navContentResult && navContentResult.page) {
					this.navContent = navContentResult.page;
					this.openNav();
				} else {
					this.closeNav();
				}
			})
		);
	}

	openNavPage(page) {
		this.nav.openNav(page);
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
		this.subscriptions.unsubscribe();
	}
}
