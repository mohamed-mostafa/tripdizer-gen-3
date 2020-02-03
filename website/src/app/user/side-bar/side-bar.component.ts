import { User } from './../user.model';
import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';

@Component({
	selector: 'c-user-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
	user: User;
	constructor(private authService: AuthService) {
		this.authService.authenticatedUser.subscribe($user => {
			this.user = $user;
		});
	}
}
