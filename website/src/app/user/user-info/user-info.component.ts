import { UserService } from './../user.service';
import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../user/user.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-app-user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnDestroy {
	user: User = {} as User;
	subUser: Subscription;
	show = false;
	constructor(private authService: AuthService, private userService: UserService) {
		this.subUser = this.authService.authenticatedUser.subscribe(user => {
			if (user) {
				this.user = user;
			}
		});
	}

	save(user) {
		this.userService.isLoading.next({ show: true, message: 'Saving data ...' });
		this.show = true;
		this.userService.update(user).subscribe(data => {
			this.authService.updateAuthenticatedUser(data['data']);
			this.userService.isLoading.next({
				show: false,
				message: '',
			});
			this.show = false;
		});
	}
	ngOnDestroy() {
		this.subUser.unsubscribe();
	}
}
