import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
	AuthService as SocialAuthService,
	FacebookLoginProvider,
	GoogleLoginProvider,
	LinkedInLoginProvider,
	SocialUser,
} from 'angularx-social-login';
import { MixpanelService } from '../../services/mixpanel.service';

declare const FB: any;

@Component({
	selector: 'c-shared-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
	user: SocialUser;

	constructor(
		public dialogRef: MatDialogRef<LoginDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private socialAuthService: SocialAuthService,
		private mixpanelService: MixpanelService
	) {}

	ngOnInit() {
		this.socialAuthService.authState.subscribe(user => (this.user = user));
	}

	close(): void {
		this.dialogRef.close();
	}

	signInWithGoogle(): void {
		this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
		this.mixpanelService.track('Sign in with Google');
	}

	signInWithFacebook(): void {
		this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
		this.mixpanelService.track('Sign in with Facebook');
	}

	signInWithLinkedIn(): void {
		this.socialAuthService.signIn(LinkedInLoginProvider.PROVIDER_ID);
		this.mixpanelService.track('Sign in with LinkedIn');
	}

	continueWithoutLogin(): void {
		this.close();
		this.mixpanelService.track('Continue without login');
	}

	signOut(): void {
		this.socialAuthService.signOut();
		this.mixpanelService.track('Sign out');
	}
}
