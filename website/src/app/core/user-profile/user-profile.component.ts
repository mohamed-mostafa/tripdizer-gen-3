import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService as SocialAuthService, SocialUser } from 'angularx-social-login';
import { LoginDialogComponent } from 'src/app/shared/components/login-dialog/login-dialog.component';

@Component({
	selector: 'c-core-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
	user: SocialUser;

	constructor(private socialAuthService: SocialAuthService, private dialog: MatDialog) {}

	ngOnInit() {
		this.socialAuthService.authState.subscribe(user => (this.user = user));
	}

	signOut(): void {
		this.socialAuthService.signOut();
	}

	openLoginDialog(): void {
		this.dialog.open(LoginDialogComponent, {
			autoFocus: true,
			maxWidth: 400,
		});
	}
}
