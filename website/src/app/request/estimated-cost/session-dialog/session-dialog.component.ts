import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'c-request-session-dialog',
	templateUrl: './session-dialog.component.html',
	styleUrls: ['./session-dialog.component.scss'],
})
export class SessionDialogComponent implements OnDestroy {
	interval;
	status = 'remaining';
	minutes = '00';
	seconds = '00';

	constructor(public dialogRef: MatDialogRef<SessionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
		if (this.data.minutes) {
			this.status = 'remaining';
			this.startTimer(this.data.minutes);
		} else {
			this.status = 'timeout';
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onOK(): void {
		this.dialogRef.close();
	}

	startTimer(minutesDuration) {
		let duration = minutesDuration * 60 - 1;

		this.calculateDuration(duration);

		this.interval = setInterval(() => {
			if (--duration <= 0) {
				this.status = 'timeout';
				this.onCancel();
			}

			this.calculateDuration(duration);
		}, 1000);
	}

	calculateDuration(duration) {
		const minutes = parseInt((duration / 60).toString(), 10);
		const seconds = parseInt((duration % 60).toString(), 10);

		this.minutes = (minutes < 10 ? '0' + minutes : minutes).toString();
		this.seconds = (seconds < 10 ? '0' + seconds : seconds).toString();
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
