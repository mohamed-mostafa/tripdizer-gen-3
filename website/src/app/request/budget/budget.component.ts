import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory, LUTBudgetCategory } from '../../shared/models/budget-category.model';
import { TrackingService } from '../../shared/services/tracking.service';
import { RequestService } from '../request.service';

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

	constructor(private requestService: RequestService, private trackingService: TrackingService) {
		this.formGroup = new FormGroup({});
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
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
			.subscribe((budgetCategories: Array<BudgetCategory>) => (this.budgetCategories = budgetCategories));
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
			}
		}
		const selectedBudgetCategory = this.budgetCategories.find(
			bc => bc.id === this.formGroup.controls['budgetCategory'].value
		);
		if (selectedBudgetCategory) {
			this.requestService.setProperty('budgetCategoryName', selectedBudgetCategory.name);
		}
		this.trackingService.track('Submit - Budget', {
			...this.formGroup.value,
			budgetCategoryName: selectedBudgetCategory.name,
		});
	}
}
