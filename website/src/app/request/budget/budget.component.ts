import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory, LUTBudgetCategory } from '../../shared/models/budget-category.model';
import { TrackingService } from '../../shared/services/tracking.service';
import { RequestService } from '../request.service';
import { Country } from 'src/app/shared/models/country.model';
import { first } from 'rxjs/operators';
import { Moment } from 'moment';

@Component({
	selector: 'c-request-budget',
	templateUrl: './budget.component.html',
	styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent {
	formGroup: FormGroup;
	controls: any = {
		budgetCategory: new FormControl(),
		budget: new FormControl('', [Validators.required]),
	};
	budgetCategories: Array<BudgetCategory>;
	isOwnBudget;
	selectedBudgetCategory: any;

	departureDate = this.requestService.getProperty('departureDate') as Moment;
	returnDate = this.requestService.getProperty('returnDate') as Moment;
	selectedCountries = this.requestService.getProperty<Array<Country>>('countries');

	minimumBudget: number;
	maximumBudget: number;

	constructor(private requestService: RequestService, private trackingService: TrackingService) {
		this.formGroup = new FormGroup({});
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}

		let firstDestination = this.selectedCountries[0];
		let numberOfDays = this.returnDate.diff(this.departureDate, 'days');
		this.minimumBudget = firstDestination.minimumTravelBudget + (firstDestination.minimumDailyBudget * numberOfDays);
		this.maximumBudget = firstDestination.minimumTravelBudget + (firstDestination.maximumDailyBudget * numberOfDays);


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
		requestService
			.getBudgetCategories()
			.subscribe((budgetCategories: Array<BudgetCategory>) => {
				if (budgetCategories.length > 4) {
					budgetCategories.splice(budgetCategories.length - 1, 1);
					this.budgetCategories = budgetCategories.reverse();
				} else {
					this.budgetCategories = budgetCategories;
				}
			});
	}

	save(): void {

		this.requestService.setProperty('budget', this.formGroup.controls.budget.value);
		const budgetAmount = this.formGroup.controls.budget.value;

		let budgetRange = this.maximumBudget - this.minimumBudget;
		let stepRange = budgetRange / 4;
		let step1 = this.minimumBudget + stepRange;
		let step2 = step1 + stepRange;
		let step3 = step2 + stepRange;

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
		this.trackingService.track('Submit - Budget', {
			...this.formGroup.value,
			budgetCategoryName: this.selectedBudgetCategory.name,
		});
	}
}
