import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'c-shared-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
	loading = false;
	isAuthenticated = false;
	authErrorMsg = new Subject<string>();

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
		this.authErrorMsg = this.authService.errorMsg;
	}

	close(): void {
		this.dialogRef.close();
	}

	signInWithGoogle(): void {
		this.loading = true;
		this.authService.signInWithGoogle();
	}

	signInWithFacebook(): void {
		this.loading = true;
		this.authService.signInWithFacebook();
	}

	signInWithLinkedIn(): void {
		this.loading = true;
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
