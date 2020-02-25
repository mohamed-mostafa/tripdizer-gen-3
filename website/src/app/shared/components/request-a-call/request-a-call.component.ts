import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
	selector: 'c-app-request-acall',
	templateUrl: './request-a-call.component.html',
	styleUrls: ['./request-a-call.component.scss'],
})
export class RequestACallComponent {
	constructor(public dialogRef: MatDialogRef<RequestACallComponent>) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
