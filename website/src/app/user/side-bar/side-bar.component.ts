import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { User } from './../user.model';

@Component({
	selector: 'c-user-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnDestroy {
	user: User;

	constructor(private authService: AuthService, private router: Router) {
		this.authService.authenticatedUser.subscribe(user => (this.user = user));
	}

	logOut() {
		this.authService.signOut();
		this.router.navigate(['/']);
	}

	ngOnDestroy() {
		this.authService.authenticatedUser.unsubscribe();
	}
}
