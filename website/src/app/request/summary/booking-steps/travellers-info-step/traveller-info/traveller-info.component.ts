import { CustomValidators } from './../../../../../shared/utils/custom.validators';
import { Gender } from './../../../../../shared/models/gender.enum';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
		firstName: new FormControl('', [
			Validators.required,
			Validators.pattern('^[a-zA-Z0-9]{0,14}$'),
			CustomValidators.leadingSpaceValidator(),
			CustomValidators.trailingSpaceValidator(),
		]),
		lastName: new FormControl('', [
			Validators.required,
			Validators.pattern('^[a-zA-Z0-9]{0,14}$'),
			CustomValidators.leadingSpaceValidator(),
			CustomValidators.trailingSpaceValidator(),
		]),
		gender: new FormControl('', [Validators.required]),
		dateOfBirth: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		nationality: new FormControl('', [Validators.required, Validators.pattern('^([A-Z][A-Z])$')]),
		email: new FormControl('', [
			Validators.required,
			CustomValidators.validEmail(),
			CustomValidators.leadingSpaceValidator(),
			CustomValidators.trailingSpaceValidator(),
		]),
		phone: new FormControl('', [Validators.required, CustomValidators.numericOnly()]),
		passportNumber: new FormControl('', [Validators.required]),
		passportExpiry: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		// passportIssueCountry: new FormControl('', [Validators.required, Validators.pattern('^([A-Z][A-Z])$')]),
	};
	travellerType: string;
	travellerNumber: number;
	gender = Gender;
	effectiveControls = [];
	currentDate = new Date();
	travellerMaxDate = () => {
		const date = new Date();

		let pastYears = 0;

		if (+this.travellerNumber === 1 && this.travellerType === 'adult') {
			pastYears = 18;
		} else if (+this.travellerNumber !== 1 && this.travellerType === 'adult') {
			pastYears = 12;
		}
		if (this.travellerType === 'kid') {
			pastYears = 2;
		}

		date.setFullYear(date.getFullYear() - pastYears);
		return date;
	};
	travellerMinDate = () => {
		const date = new Date();

		if (!this.travellerType || this.travellerType === 'adult') {
			return null;
		}

		let pastYears = 0;

		if (this.travellerType === 'kid') {
			pastYears = 12;
		}
		if (this.travellerType === 'infant') {
			pastYears = 2;
		}

		date.setFullYear(date.getFullYear() - pastYears);
		return date;
	};

	constructor(private translate: TranslateService) {}

	ngOnInit() {
		const info = this.controlName.match(/(adult|kid|infant)-([0-9]+)/);
		this.travellerType = info[1];
		this.travellerNumber = info[2];

		const firstAdultControls = [
			'title',
			'firstName',
			'lastName',
			'dateOfBirth',
			'nationality',
			'email',
			'phone',
			'passportNumber',
			'passportExpiry',
		];
		const otherAdultsControls = ['title', 'firstName', 'lastName', 'dateOfBirth', 'passportNumber', 'passportExpiry'];
		const kidsControls = ['title', 'firstName', 'lastName', 'dateOfBirth', 'passportNumber', 'passportExpiry'];
		const infantsControls = ['title', 'firstName', 'lastName', 'dateOfBirth', 'passportNumber', 'passportExpiry'];

		this.effectiveControls = firstAdultControls;
		if (this.travellerType === 'adult' && this.travellerNumber > 1) {
			this.effectiveControls = otherAdultsControls;
		} else if (this.travellerType === 'kid') {
			this.effectiveControls = kidsControls;
		} else if (this.travellerType === 'infant') {
			this.effectiveControls = infantsControls;
		}

		for (const controlName in this.controls) {
			if (this.effectiveControls.find(item => controlName === item)) {
				if (this.controls.hasOwnProperty(controlName)) {
					this.formGroup.addControl(`${this.controlName}-${controlName}`, this.controls[controlName]);
				}
			}
		}
	}

	getTitles(): Array<string> {
		const titles = this.translate.instant('user.user_info.titles');

		return titles[this.travellerType];
	}

	getTravellerTitle(): string {
		const type = this.translate.instant(`request.estimated_cost.summary.traveller_info.${this.travellerType}`);
		const number = this.translate.instant(`request.estimated_cost.summary.numbers.${this.travellerNumber}`);
		if (this.translate.currentLang === 'ar') {
			return `${type} ${number}`;
		}
		return `${number} ${type}`;
	}

	getControlVisibility(controlName): boolean {
		return this.effectiveControls.includes(controlName);
	}
}
