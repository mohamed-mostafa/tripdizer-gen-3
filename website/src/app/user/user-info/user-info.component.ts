import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../user/user.model';

@Component({
	selector: 'c-app-user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnDestroy {
	user: User = {} as User;

	constructor(private authService: AuthService) {
		this.authService.authenticatedUser.subscribe(user => (this.user = user));
	}

	ngOnDestroy() {
		this.authService.authenticatedUser.unsubscribe();
	}
}
