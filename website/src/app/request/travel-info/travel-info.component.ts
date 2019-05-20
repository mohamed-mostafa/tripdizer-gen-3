import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService as SocialAuthService } from 'angularx-social-login';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { LoginDialogComponent } from 'src/app/shared/components/login-dialog/login-dialog.component';
import { MixpanelService } from '../../shared/services/mixpanel.service';
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
export class TravelInfoComponent implements OnInit {
	formGroup: FormGroup;
	controls: any = {
		travelingFrom: new FormControl('', [Validators.required]),
		destination: new FormControl('', [Validators.required]),
		departureDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		returnDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		isFlexibleDates: new FormControl(),
	};
	destinations: Array<Destination>;
	preSelectedDestinationName: string;
	minDate = new Date();
	dialogLabels: {
		title: string;
		description: string;
		inputs: { input0: string };
		buttonsLabel: { ok: string; cancel: string };
	};
	isHavePlan: boolean;
	firstTimeLogin = true;
	loginDialogRef: MatDialogRef<LoginDialogComponent, any>;

	constructor(
		route: ActivatedRoute,
		private requestService: RequestService,
		private mixpanelService: MixpanelService,
		private dialog: MatDialog,
		private socialAuthService: SocialAuthService,
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
				validators: CustomValidators.dateGreaterThan('departureDate', 'returnDate', compareDatesValidationMsg),
			}
		);
		this.isHavePlan = this.requestService.getRequestType() === RequestType.HavePlan;
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				if (!(!this.isHavePlan && controlName === 'destination')) {
					(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
					this.formGroup.addControl(controlName, this.controls[controlName]);
				}
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
		requestService.getDestinations().subscribe(destinations => {
			this.destinations = destinations.filter(dest => dest.id !== -1);
			this.preSelectedDestination();
		});
		route.params.subscribe(params => {
			if (params.destinationName) {
				this.preSelectedDestinationName = params.destinationName;
				this.preSelectedDestination();
			}
		});
	}

	ngOnInit() {
		this.socialAuthService.authState.subscribe(user => {
			if (user) {
				if (this.loginDialogRef) {
					this.loginDialogRef.close();
				}
				this.requestService.setProperty('socialSigning', true);
				this.requestService.setProperty('travelerName', user.name);
				this.requestService.setProperty('travelerEmail', user.email);
			} else {
				if (this.firstTimeLogin) {
					this.openLoginDialog();
				}
			}
		});
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				// 				if (controlName === 'destination') {
				// let tempDestination:Destination;
				// 					const destinationId = this.formGroup.controls[controlName].value;
				// 					if (destinationId === -1) {
				// 						tempDestination = this.otherDestination;
				// 					} else {
				// 						 tempDestination = this.destinations.filter(
				// 							destination => destination.id === this.formGroup.controls[controlName].value
				// 						);
				// 					}
				// 					this.requestService.setProperty(controlName, tempDestination);
				// 				} else {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
				// }
			}
		}
		this.mixpanelService.track('Submit - Travel Info', {
			...this.formGroup.value,
			departureDate: moment(this.formGroup.get('departureDate').value).format('D / M / Y'),
			returnDate: moment(this.formGroup.get('returnDate').value).format('D / M / Y'),
			isFlexibleDates: this.formGroup.get('isFlexibleDates').value,
		});
	}

	preSelectedDestination(): void {
		if (this.preSelectedDestinationName) {
			if (Array.isArray(this.destinations) && this.destinations.length) {
				const selectedDestination = this.destinations.find(
					d => d.enName && d.enName.toLowerCase() === this.preSelectedDestinationName.toLowerCase()
				);
				if (selectedDestination) {
					this.formGroup.get('destination').setValue(selectedDestination);
				}
			}
		}
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
					iataCode: inputs[0].value,
					image: null,
					visaTypeName: null,
				};
				this.formGroup.get('destination').setValue({ ...destination, triggered: true });
				this.mixpanelService.track('Submit - Destination', {
					destinationId: destination.id,
					destinationName: destination.name,
				});
			}
		});
	}

	openLoginDialog(): void {
		this.firstTimeLogin = false;
		this.loginDialogRef = this.dialog.open(LoginDialogComponent, {
			autoFocus: true,
			maxWidth: 400,
		});
	}
}
