import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CustomValidators } from 'src/app/shared/utils';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { Gender } from '../requester.model';

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
			CustomValidators.equalTo('travelerEmail', 'Email doesn\'t match'),
		]),
		travelerGender: new FormControl('', [Validators.required]),
		travelerBirthday: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		travelerProfession: new FormControl('', [Validators.required]),
		referralType: new FormControl('', [Validators.required]),
	};
	professions: Observable<Array<DropDownItem>>;
	referralTypes: Observable<Array<DropDownItem>>;
	gender = Gender;
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
		this.professions = requestService.getProfessions();
		this.referralTypes = requestService.getReferralTypes();
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
			}
		}
	}
}
