import { Purpose, LUTPurpose } from './../../shared/models/purpose.model';
import { BudgetCategory, LUTBudgetCategory } from './../../shared/models/budget-category.model';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Country } from '../../shared/models/country.model';
import { TrackingService } from '../../shared/services/tracking.service';
import { CustomValidators } from '../../shared/utils';
import { RequestType } from '../request-type.enum';
import { RequestService } from '../request.service';
@Component({
	selector: 'c-request-travel-info',
	templateUrl: './travel-info.component.html',
	styleUrls: ['./travel-info.component.scss'],
})
export class TravelInfoComponent {
	formGroup: FormGroup;
	controls: any = {
		destination: new FormControl('', [
			CustomValidators.conditionallyRequired(() =>
				Boolean(!this.isHavePlan || (this.selectedCountries && this.selectedCountries.length))
			),
		]),
		departureDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		returnDate: new FormControl('', [Validators.required, CustomValidators.dateValid()]),
		isFlexibleDates: new FormControl(),
		//budget
		budgetCategory: new FormControl(),
		budget: new FormControl('', [Validators.required]),
		//purpose
		purpose: new FormControl('', [Validators.required]),
	};
	countries: Observable<Array<Country>>;
	selectedCountries: Array<Country> = [];
	minDate = new Date();
	isHavePlan: boolean;
	//budget
	budgetCategories: Array<BudgetCategory>;
	isOwnBudget;
	selectedBudgetCategory: any;
	minimumBudget: number;
	maximumBudget: number;
	//purpose
	purposes: Array<Purpose>;
	LUTPurpose = LUTPurpose;
	otherPurposeName = '';
	//header
	selectedCountryImage: string;
	selectedCountriesName: string;

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
				if (this.requestService.getProperty(controlName) === LUTPurpose.Other) {
					this.otherPurposeName = this.requestService.getProperty('purposeName');
				}
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
		this.formGroup.controls['departureDate'].valueChanges.subscribe(departureDate => {
			if (!this.formGroup.controls['returnDate'].value) {
				this.formGroup.controls['returnDate'].setValue(moment(departureDate).add(1, 'days'));
			}
		});
		this.countries = requestService.getCountries();
		this.selectedCountries = this.requestService.getProperty<Array<Country>>('countries');
		const selected = [...this.requestService.getProperty<Array<Country>>('countries')];
		const selected2 = selected;
		this.selectedCountriesName = selected.map(c => c.name).join(' - ');
		this.selectedCountryImage = selected2.shift().thumbnail;
		this.formGroup.get('destination').reset();
		const departureDate = this.formGroup.get('departureDate').value;
		if (departureDate) {
			this.calculateBudget();
		}
		requestService.getPurposes().subscribe((purposes: Array<Purpose>) => (this.purposes = purposes));
	}
	calculateBudget() {
		const departureDate = this.formGroup.get('departureDate').value;
		const returnDate = this.formGroup.get('returnDate').value;
		const firstDestination = this.selectedCountries[0];
		const numberOfDays = returnDate.diff(departureDate, 'days');
		this.minimumBudget = firstDestination
			? firstDestination.minimumTravelBudget + firstDestination.minimumDailyBudget * numberOfDays
			: 10000;
		this.maximumBudget = firstDestination
			? firstDestination.minimumTravelBudget + firstDestination.maximumDailyBudget * numberOfDays
			: 100000;

		this.formGroup.controls['budget'].setValue(this.minimumBudget);

		this.isOwnBudget = this.formGroup.controls['budgetCategory'].value === LUTBudgetCategory.OwnBudget;
		this.formGroup.controls['budgetCategory'].valueChanges.subscribe(data => {
			this.isOwnBudget = data === LUTBudgetCategory.OwnBudget;
			if (!this.isOwnBudget) {
				this.formGroup.controls['budget'].setValue(0);
			}
		});
		this.formGroup.controls['budget'].valueChanges.subscribe(data => {
			this.isOwnBudget = data > 0;
			if (this.isOwnBudget) {
				this.formGroup.controls['budgetCategory'].setValue(1);
			}
		});
		this.requestService.getBudgetCategories().subscribe((budgetCategories: Array<BudgetCategory>) => {
			if (budgetCategories.length > 4) {
				budgetCategories.splice(budgetCategories.length - 1, 1);
				this.budgetCategories = budgetCategories.reverse();
			} else {
				this.budgetCategories = budgetCategories;
			}
		});
	}
	otherPurposeFocused(): void {
		this.formGroup.get('purpose').setValue(LUTPurpose.Other);
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
		//budget
		this.requestService.setProperty('budget', this.formGroup.controls.budget.value);
		const budgetAmount = this.formGroup.controls.budget.value;

		const budgetRange = this.maximumBudget - this.minimumBudget;
		const stepRange = budgetRange / 4;
		const step1 = this.minimumBudget + stepRange;
		const step2 = step1 + stepRange;
		const step3 = step2 + stepRange;

		if (budgetAmount > this.minimumBudget && budgetAmount <= step1) {
			this.selectedBudgetCategory = this.budgetCategories[0];
		}

		if (budgetAmount > step1 && budgetAmount <= step2) {
			this.selectedBudgetCategory = this.budgetCategories[1];
		}

		if (budgetAmount > step2 && budgetAmount <= step3) {
			this.selectedBudgetCategory = this.budgetCategories[2];
		}

		if (budgetAmount > step3 && budgetAmount <= this.maximumBudget) {
			this.selectedBudgetCategory = this.budgetCategories[3];
		}
		this.requestService.setProperty('budgetCategoryName', this.selectedBudgetCategory.name);
		this.requestService.setProperty('budgetCategory', this.selectedBudgetCategory.id);
		//purpose
		const selectedPurpose = this.purposes.find(p => p.id === this.formGroup.controls['purpose'].value);
		if (selectedPurpose) {
			if (selectedPurpose.id === LUTPurpose.Other) {
				selectedPurpose.name = this.otherPurposeName;
			}
			this.requestService.setProperty('purposeName', selectedPurpose.name);
			this.requestService.setProperty('adultsNumber', selectedPurpose.adultsNumber);
			this.requestService.setProperty('kidsNumber', selectedPurpose.kidsNumber);
			this.requestService.setProperty('infantsNumber', selectedPurpose.infantsNumber);
		}
		this.trackingService.track('Submit - Travel Info', {
			...this.formGroup.value,
			travelingFrom: 'Cairo',
			departureDate: moment(this.formGroup.get('departureDate').value).format('D / M / Y'),
			returnDate: moment(this.formGroup.get('returnDate').value).format('D / M / Y'),
			isFlexibleDates: false,
			budgetCategoryName: this.selectedBudgetCategory.name,
			purposeName: selectedPurpose.name,
		});
	}
}
