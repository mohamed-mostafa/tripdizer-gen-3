import { UserService } from './../user.service';
import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../user/user.model';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'c-app-user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnDestroy {
	user: User = {} as User;
	subUser: Subscription;
	show = false;
	constructor(private authService: AuthService, private userService: UserService, private spinner: NgxSpinnerService) {
		this.subUser = this.authService.authenticatedUser.subscribe(user => {
			if (user) {
				this.user = user;
			}
		});
	}

	save(user) {
		this.show = true;
		this.userService.update(user).subscribe(data => {
			this.authService.updateAuthenticatedUser(data['data']);
			this.show = false;
		});
	}
	ngOnDestroy() {
		this.subUser.unsubscribe();
	}
}
