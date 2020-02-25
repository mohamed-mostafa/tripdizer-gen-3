import { RequestACallComponent } from './../request-a-call/request-a-call.component';
import { CustomValidators } from './../../utils/custom.validators';
import { DialogData } from './dialog.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
@Component({
	selector: 'c-let-me-decide',
	templateUrl: './let-me-decide.component.html',
	styleUrls: ['./let-me-decide.component.scss'],
})
export class LetMeDecideComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<LetMeDecideComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		public dialog: MatDialog
	) {}
	controls: any = {
		name: new FormControl('', [
			Validators.required,
			Validators.pattern('^[a-zA-Z0-9]{0,14}$'),
			CustomValidators.leadingSpaceValidator(),
			CustomValidators.trailingSpaceValidator(),
		]),
		email: new FormControl('', [
			Validators.required,
			CustomValidators.validEmail(),
			CustomValidators.leadingSpaceValidator(),
			CustomValidators.trailingSpaceValidator(),
		]),
		mobile: new FormControl('', [Validators.required, CustomValidators.numericOnly()]),
	};

	onNoClick(): void {
		this.dialogRef.close();
	}
	getErrorMessage(val) {
		if (val === 'name') {
			return this.controls.name.hasError('required')
				? 'You must enter a value'
				: this.controls.name.hasError('name')
				? 'Not a valid name'
				: '';
		} else if (val === 'mobile') {
			return this.controls.mobile.hasError('required')
				? 'You must enter a value'
				: this.controls.mobile.hasError('mobile')
				? 'Not a valid mobile'
				: '';
		} else {
			return this.controls.email.hasError('required')
				? 'You must enter a value'
				: this.controls.email.hasError('email')
				? 'Not a valid email'
				: '';
		}
	}
	save(data) {
		if (data.email && data.name && data.mobile && !this.controls.email.hasError('email')) {
			let res = data;
			this.dialogRef.close();
			this.dialog.open(RequestACallComponent);
		}
	}
	ngOnInit() {}
}
