import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'c-shared-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
	isAuthenticated = false;

	constructor(
		public dialogRef: MatDialogRef<LoginDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.authService.isAuthenticated.subscribe(value => {
			if (value) {
				this.close();
			}
			this.isAuthenticated = value;
		});
	}

	close(): void {
		this.dialogRef.close();
	}

	signInWithGoogle(): void {
		this.authService.signInWithGoogle();
	}

	signInWithFacebook(): void {
		this.authService.signInWithFacebook();
	}

	signInWithLinkedIn(): void {
		this.authService.signInWithLinkedIn();
	}

	continueWithoutLogin(): void {
		this.close();
		this.authService.continueWithoutLogin();
	}

	signOut(): void {
		this.authService.signOut();
	}
}
