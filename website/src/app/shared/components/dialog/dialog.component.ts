import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/* Models */
import { Dialog } from './dialog.model';

@Component({
	selector: 'c-shared-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
	formGroup: FormGroup;

	constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Dialog) {
		this.formGroup = new FormGroup({});
		for (const dataInput of data.inputs) {
			const input = new FormControl(dataInput.formState, dataInput.validatorOrOpts, dataInput.asyncValidator);
			input.setValue(dataInput.value);
			this.formGroup.addControl(dataInput.id, input);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onOK(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				const index = this.data.inputs.findIndex(i => i.id === controlName);
				if (index !== -1) {
					this.data.inputs[index].value = this.formGroup.controls[controlName].value;
				}
			}
		}
		this.dialogRef.close(this.data.inputs.map(i => ({ id: i.id, value: i.value })));
	}
}
