import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
	selector: 'c-app-request-acall',
	templateUrl: './request-a-call.component.html',
	styleUrls: ['./request-a-call.component.scss'],
})
export class RequestACallComponent {
	constructor(public dialogRef: MatDialogRef<RequestACallComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
