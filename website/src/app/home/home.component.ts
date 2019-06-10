import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { TrackingService } from '../shared/services/tracking.service';
import { CustomValidators } from '../shared/utils';
import { HomeService } from './home.service';

@Component({
	selector: 'c-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnDestroy {
	dialogLabels: {
		title: string;
		description: string;
		inputs: { input0: string };
		buttonsLabel: { ok: string; cancel: string };
	};
	navBarHeight: number;
	navBarHeightSubject = new Subject<number>();

	constructor(
		private homeService: HomeService,
		private dialog: MatDialog,
		private trackingService: TrackingService,
		router: Router,
		translate: TranslateService
	) {
		translate.get('home.dialog').subscribe(labels => (this.dialogLabels = labels));

		// setTimeout(() => {
		// 	this.openDialog();
		// }, 5000);

		router.events.subscribe(() => {
			this.resizeFirstElement();
		});

		this.navBarHeightSubject.subscribe(height => {
			this.navBarHeight = height;
			this.resizeFirstElement();
		});
	}

	resizeFirstElement() {
		const firstElement = document.getElementsByTagName('section')[0];
		firstElement.style.height = document.body.clientHeight - this.navBarHeight + 'px';
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
				this.trackingService.track('Submit Help Popup', {
					event_category: 'Submit Help Popup',
					event_label: 'PhoneNumber: ' + inputs[0].value,
					value: inputs[0].value,
				});
			} else {
				this.trackingService.track('Cancel Help Popup', {
					event_category: 'Cancel Help Popup',
					event_label: 'N/A',
					value: 'N/A',
				});
			}
		});
		this.trackingService.track('Display Help Popup', {
			event_category: 'Display Help Popup',
			event_label: 'N/A',
			value: 'N/A',
		});
	}

	ngOnDestroy() {
		this.navBarHeightSubject.unsubscribe();
	}
}
