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

	constructor(private authService: AuthService, private userService: UserService) {
		this.subUser = this.authService.authenticatedUser.subscribe(user => {
			if (user) {
				console.log(user);

				this.user = user;
			}
		});
	}

	save(user) {
		console.log(user);

		this.userService.update(user).subscribe(data => {
			console.log(data);
		});
	}
	ngOnDestroy() {
		this.subUser.unsubscribe();
	}
}
