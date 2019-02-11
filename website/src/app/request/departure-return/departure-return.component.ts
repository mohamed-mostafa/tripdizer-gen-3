import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CustomValidators } from '../../shared/utils';

/* Services */
import { RequestService } from '../request.service';

@Component({
	selector: 'c-request-departure-return',
	templateUrl: './departure-return.component.html',
	styleUrls: ['./departure-return.component.scss'],
})
export class DepartureReturnComponent {
	formGroup: FormGroup;
	controls: any = {
		departureDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		returnDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		isFlexibleDates: new FormControl(),
	};
	minDate = new Date();

	constructor(private requestService: RequestService, translate: TranslateService) {
		let compareDatesValidationMsg: string;
		translate
			.stream('request.departure_return.compare_dates')
			.subscribe(validationMsg => (compareDatesValidationMsg = validationMsg));
		this.formGroup = new FormGroup(
			{},
			{
				validators: CustomValidators.dateGreaterThan('departureDate', 'returnDate', compareDatesValidationMsg),
			}
		);
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
		this.formGroup.controls['departureDate'].valueChanges.subscribe(departureDate => {
			if (!this.formGroup.controls['returnDate'].value) {
				this.formGroup.controls['returnDate'].setValue(moment(departureDate).add(1, 'days'));
			}
		});
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
			}
		}
	}
}
