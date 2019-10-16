import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/shared/components/login-dialog/login-dialog.component';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
	selector: 'c-core-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
	user: User;
	rowSpanNum = 1;
	setRowSpanNumTimeout: any;

	constructor(private authService: AuthService, private dialog: MatDialog) {}

	ngOnInit() {
		this.authService.authenticatedUser.subscribe(user => (this.user = user));
	}

	signOut(): void {
		this.authService.signOut();
	}

	setRowSpanNum(num: number) {
		clearTimeout(this.setRowSpanNumTimeout);
		this.setRowSpanNumTimeout = setTimeout(() => {
			this.rowSpanNum = num;
		}, 0);
	}

	openLoginDialog(): void {
		this.dialog.open(LoginDialogComponent, {
			autoFocus: true,
			maxWidth: 400,
		});
	}
}
