import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { CustomValidators } from '../shared/utils';
import { HomeService } from './home.service';

declare const gtag: Function;

@Component({
	selector: 'c-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	dialogLabels: {
		title: string;
		description: string;
		inputs: { input0: string };
		buttonsLabel: { ok: string; cancel: string };
	};

	constructor(private homeService: HomeService, private dialog: MatDialog, translate: TranslateService) {
		translate.get('home.dialog').subscribe(labels => (this.dialogLabels = labels));
		setTimeout(() => {
			this.openDialog();

		}, 5000);
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(DialogComponent, {
			autoFocus: true,
			maxWidth: 400,
			data: {
				title: this.dialogLabels ? this.dialogLabels.title : '',
				description: this.dialogLabels ? this.dialogLabels.description : '',
				inputs: [
					{
						id: 'phoneNumber',
						value: null,
						placeHolder: this.dialogLabels && this.dialogLabels.inputs ? this.dialogLabels.inputs.input0 : '',
						validatorOrOpts: [Validators.required, CustomValidators.numericOnly()],
					},
				],
				buttonsLabel: {
					ok: this.dialogLabels && this.dialogLabels.buttonsLabel ? this.dialogLabels.buttonsLabel.ok : '',
					cancel: this.dialogLabels && this.dialogLabels.buttonsLabel ? this.dialogLabels.buttonsLabel.cancel : '',
				},
			},
		});

		dialogRef.afterClosed().subscribe(inputs => {
			if (inputs && inputs[0]) {
				this.homeService.savePhoneNumber(inputs[0].value);
				gtag('event', 'Submit Help Popup', {
					event_category: 'Submit Help Popup',
					event_label: 'PhoneNumber: ' + inputs[0].value,
					value: inputs[0].value,
				});
			} else {
				gtag('event', 'Cancel Help Popup', {
					event_category: 'Cancel Help Popup',
					event_label: 'N/A',
					value: 'N/A',
				});
			}
		});
		
		gtag('event', 'Display Help Popup', {
			event_category: 'Display Help Popup',
			event_label: 'N/A',
			value: 'N/A',
		});
	}
}
