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
	selectedBudgetCategory: any;

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
			.subscribe((budgetCategories: Array<BudgetCategory>) => {
				if (budgetCategories.length > 4) {
					budgetCategories.splice(budgetCategories.length - 1, 1);
					this.budgetCategories = budgetCategories.reverse();
					console.log(this.budgetCategories);
				} else {
					this.budgetCategories = budgetCategories;
					console.log(this.budgetCategories);
				}
			});
	}

	save(): void {

		this.requestService.setProperty('budget', this.formGroup.controls.budget.value);
		const budgetAmount = this.formGroup.controls.budget.value;
		console.log(budgetAmount);

		if (budgetAmount > 0 && budgetAmount <= 15000) {
			this.selectedBudgetCategory = this.budgetCategories[0];
		}

		if (budgetAmount > 15000 && budgetAmount <= 30000) {
			this.selectedBudgetCategory = this.budgetCategories[1];
		}

		if (budgetAmount > 30000 && budgetAmount <= 45000) {
			this.selectedBudgetCategory = this.budgetCategories[2];
		}

		if (budgetAmount > 45000 && budgetAmount <= 60000) {
			this.selectedBudgetCategory = this.budgetCategories[3];
		}

		this.requestService.setProperty('budgetCategoryName', this.selectedBudgetCategory.name);
		this.trackingService.track('Submit - Budget', {
			...this.formGroup.value,
			budgetCategoryName: this.selectedBudgetCategory.name,
		});
	}
}
