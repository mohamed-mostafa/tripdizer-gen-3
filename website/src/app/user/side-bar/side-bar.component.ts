import { User } from './../user.model';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'c-user-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnDestroy {
	private subscriptions = new Subscription();

	user: User;
	constructor(private authService: AuthService) {
		this.subscriptions.add(
			this.authService.authenticatedUser.subscribe($user => {
				this.user = $user;
				console.log(this.user);
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
