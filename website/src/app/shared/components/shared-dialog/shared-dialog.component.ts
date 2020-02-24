import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'c-request-shared-dialog',
	templateUrl: './shared-dialog.component.html',
	styleUrls: ['./shared-dialog.component.scss'],
})
export class SharedDialogComponent {
	message = '';
	url = '';
	constructor(
		public dialogRef: MatDialogRef<SharedDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private router: Router
	) {
		this.message = this.data.message;
		this.url = this.data.url;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onOK(): void {
		this.dialogRef.close();
		this.router.navigate([`${this.url}`]);
	}
}
