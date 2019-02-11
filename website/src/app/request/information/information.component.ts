import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from 'src/app/shared/utils';

/* Services */
import { RequestService } from '../request.service';

@Component({
	selector: 'c-request-information',
	templateUrl: './information.component.html',
	styleUrls: ['./information.component.scss'],
})
export class InformationComponent {
	formGroup: FormGroup;
	controls: any = {
		travelerName: new FormControl('', [Validators.required, CustomValidators.notEmpty()]),
		travelerMobile: new FormControl('', [Validators.required, CustomValidators.numericOnly()]),
		travelerEmail: new FormControl('', [Validators.required, Validators.email]),
		travelerEmailConfirmation: new FormControl('', [
			Validators.required,
			Validators.email,
			CustomValidators.equalTo('travelerEmail', "Email doesn't match"),
		]),
		travelerBirthday: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		referralType: new FormControl('', [Validators.required]),
	};
	referralTypes: Array<{ id: number; name: string }>;
	maxDate = new Date();

	constructor(private requestService: RequestService, translate: TranslateService) {
		translate.stream('request.information.equal_to').subscribe(validationMsg => {
			(this.controls['travelerEmailConfirmation'] as FormControl).setValidators([
				CustomValidators.equalTo('travelerEmail', validationMsg),
			]);
		});
		this.formGroup = new FormGroup({});
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
		requestService.getReferralTypes().subscribe((referralTypes: Array<any>) => (this.referralTypes = referralTypes));
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
			}
		}
	}
}
