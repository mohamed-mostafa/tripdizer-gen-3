import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../../shared/services/auth.service';
import { User } from './../user.model';

@Component({
	selector: 'c-user-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
	user: Observable<User>;

	constructor(private authService: AuthService, private router: Router) {
		this.user = this.authService.authenticatedUser;
	}

	logOut() {
		this.authService.signOut();
		this.router.navigate(['/']);
	}
}
