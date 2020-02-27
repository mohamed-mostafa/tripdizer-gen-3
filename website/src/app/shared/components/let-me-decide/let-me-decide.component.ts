import { SuccessResponse } from './../../../../../../users/src/models/response';
import { HttpClient } from '@angular/common/http';
import { CustomValidators } from './../../utils/custom.validators';
import { RequestACallComponent } from './../request-a-call/request-a-call.component';
import { DialogData } from './dialog.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
	selector: 'c-let-me-decide',
	templateUrl: './let-me-decide.component.html',
	styleUrls: ['./let-me-decide.component.scss'],
})
export class LetMeDecideComponent implements OnInit {
	userModal: FormGroup;
	submitted = false;
	constructor(
		public dialogRef: MatDialogRef<LetMeDecideComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		public dialog: MatDialog,
		private formBuilder: FormBuilder,
		private http: HttpClient
	) {}
	ngOnInit() {
		this.userModal = this.formBuilder.group({
			name: [
				'',
				[
					Validators.required,
					Validators.pattern('^[a-zA-Z0-9]{0,14}$'),
					CustomValidators.leadingSpaceValidator(),
					CustomValidators.trailingSpaceValidator(),
				],
			],
			mobile: ['', [Validators.required, CustomValidators.numericOnly()]],
			email: [
				'',
				[
					Validators.required,
					CustomValidators.validEmail(),
					CustomValidators.leadingSpaceValidator(),
					CustomValidators.trailingSpaceValidator(),
				],
			],
		});
	}
	get f() {
		return this.userModal.controls;
	}
	onReset() {
		this.submitted = false;
		this.userModal.reset();
		this.dialogRef.close();
	}
	onSubmit() {
		this.submitted = true;
		if (this.userModal.invalid) {
			return;
		}
		const result = this.userModal.value;
		return this.http.post<void>(`requests/requestACall`, result).subscribe(
			() => {
				this.dialogRef.close();
				this.dialog.open(RequestACallComponent, {
					data: {
						success: true,
					},
				});
			},
			error => {
				this.dialogRef.close();
				this.dialog.open(RequestACallComponent, {
					data: {
						fail: true,
					},
				});
			}
		);
	}
}
