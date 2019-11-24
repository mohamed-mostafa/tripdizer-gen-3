import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/utils';
import { Gender } from 'src/app/shared/models/gender.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'c-request-traveller-info',
	templateUrl: './traveller-info.component.html',
	styleUrls: ['./traveller-info.component.scss'],
})
export class TravellerInfoComponent implements OnInit {
	@Input() formGroup: FormGroup;
	@Input() controlName;
	controls: any = {
		title: new FormControl('', [Validators.required]),
		firstName: new FormControl('', [Validators.required]),
		lastName: new FormControl('', [Validators.required]),
		gender: new FormControl('', [Validators.required]),
		dateOfBirth: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		nationality: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required]),
		phone: new FormControl('', [Validators.required]),
		passportNumber: new FormControl('', [Validators.required]),
		passportExpiry: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		passportIssueCountry: new FormControl('', [Validators.required]),
	};
	gender = Gender;
	maxDate = new Date();

	constructor(private translate: TranslateService) {}

	ngOnInit() {
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				this.formGroup.addControl(`${this.controlName}-${controlName}`, this.controls[controlName]);
			}
		}
	}

	getTravellerTitle(): string {
		const info = this.controlName.match(/(adult|kid|infant)-([0-9]+)/);
		if (info) {
			const type = this.translate.instant(`request.estimated_cost.summary.traveller_info.${info[1]}`);
			const number = this.translate.instant(`request.estimated_cost.summary.numbers.${info[2]}`);
			if (this.translate.currentLang === 'ar') {
				return `${type} ${number}`;
			}
			return `${number} ${type}`;
		} else {
			return '';
		}
	}
}
