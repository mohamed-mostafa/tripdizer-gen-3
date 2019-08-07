import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { Country } from '../../shared/models/country.model';
import { TrackingService } from '../../shared/services/tracking.service';
import { CustomValidators } from '../../shared/utils';
import { Destination } from '../destinations/destination.model';
import { RequestType } from '../request-type.enum';
import { RequestService } from '../request.service';
import { TravelingFrom } from '../traveling-from/traveling-from.model';

@Component({
	selector: 'c-request-travel-info',
	templateUrl: './travel-info.component.html',
	styleUrls: ['./travel-info.component.scss'],
})
export class TravelInfoComponent {
	formGroup: FormGroup;
	controls: any = {
		travelingFrom: new FormControl('', [Validators.required]),
		destination: new FormControl('', [
			CustomValidators.conditionallyRequired(() => Boolean(this.isHavePlan || (this.selectedCountries && this.selectedCountries.length))),
		]),
		departureDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		returnDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		isFlexibleDates: new FormControl(),
	};
	countries: Observable<Array<Country>>;
	selectedCountries: Array<Country> = [];
	minDate = new Date();
	dialogLabels: {
		title: string;
		description: string;
		inputs: { input0: string };
		buttonsLabel: { ok: string; cancel: string };
	};
	isHavePlan: boolean;

	constructor(
		private requestService: RequestService,
		private trackingService: TrackingService,
		private dialog: MatDialog,
		translate: TranslateService
	) {
		let compareDatesValidationMsg: string;
		translate
			.stream('request.travel_info.compare_dates')
			.subscribe(validationMsg => (compareDatesValidationMsg = validationMsg));
		translate.get('request.travel_info.dialog').subscribe(labels => (this.dialogLabels = labels));
		this.formGroup = new FormGroup(
			{},
			{
				validators: [CustomValidators.dateGreaterThan('departureDate', 'returnDate', compareDatesValidationMsg)],
			}
		);
		this.isHavePlan = this.requestService.getRequestType() === RequestType.HavePlan;
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				if (controlName !== 'destination') {
					(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				}
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
		// this.formGroup.controls['destination'].valueChanges.subscribe(destinationId => {
		// 	if (destinationId === -1 && !destination['triggered']) {
		// 		this.openDialog();
		// 	}
		// });
		this.formGroup.controls['departureDate'].valueChanges.subscribe(departureDate => {
			if (!this.formGroup.controls['returnDate'].value) {
				this.formGroup.controls['returnDate'].setValue(moment(departureDate).add(1, 'days'));
			}
		});
		this.countries = requestService.getCountries();
		setTimeout(() => {
			this.selectedCountries = this.requestService.getProperty<Array<Country>>('countries');
			this.formGroup.get('destination').reset();
		}, 0);
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				if (controlName === 'destination') {
					this.requestService.setProperty('destination', this.formGroup.controls[controlName].value);
				} else {
					this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
				}
			}
		}
		this.trackingService.track('Submit - Travel Info', {
			...this.formGroup.value,
			departureDate: moment(this.formGroup.get('departureDate').value).format('D / M / Y'),
			returnDate: moment(this.formGroup.get('returnDate').value).format('D / M / Y'),
			isFlexibleDates: this.formGroup.get('isFlexibleDates').value,
		});
	}

	compareObjects = (o1: TravelingFrom, o2: TravelingFrom) => o1.iataCode === o2.iataCode;

	openDialog(): void {
		const dialogRef = this.dialog.open(DialogComponent, {
			autoFocus: true,
			maxWidth: 400,
			data: {
				title: this.dialogLabels ? this.dialogLabels.title : '',
				description: this.dialogLabels ? this.dialogLabels.description : '',
				inputs: [
					{
						id: 'destinationName',
						value: this.requestService.getProperty('destination')
							? this.requestService.getProperty('destination').name
							: null,
						placeHolder: this.dialogLabels && this.dialogLabels.inputs ? this.dialogLabels.inputs.input0 : '',
						validatorOrOpts: [Validators.required],
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
				const destination: Destination = {
					id: -1,
					name: inputs[0].value,
					description: null,
					ISOCode: inputs[0].value,
					image: null,
					visaTypeName: null,
				};
				this.formGroup.get('destination').setValue({ ...destination, triggered: true });
				this.trackingService.track('Submit - Destination', {
					destinationId: destination.id,
					destinationName: destination.name,
				});
			}
		});
	}
}
