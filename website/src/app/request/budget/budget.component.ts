import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { BudgetCategory } from './budget-category.model';

@Component({
  selector: 'c-request-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent {
  nextStepPath: string;
  prevStepPath: string;
  formGroup: FormGroup;
  controls: any = {
    'budgetCategory': new FormControl(),
    'budget': new FormControl('', [Validators.required])
  };
  budgetCategories: Array<BudgetCategory>;

  constructor(
    route: ActivatedRoute,
    private requestService: RequestService
  ) {
    const currentStepPath = route.routeConfig.path;
    this.formGroup = new FormGroup({});
    for (const controlName in this.controls) {
      if (this.controls.hasOwnProperty(controlName)) {
        (this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
        this.formGroup.addControl(controlName, this.controls[controlName]);
      }
    }
    if (this.formGroup.controls['budgetCategory'].value !== 1) {
      this.formGroup.controls['budget'].disable();
    } else {
      this.formGroup.controls['budget'].enable();
    }
    this.formGroup.controls['budgetCategory'].valueChanges.subscribe(data => {
      if (data !== 1) {
        this.formGroup.controls['budget'].disable();
      } else {
        this.formGroup.controls['budget'].enable();
      }
    });
    requestService.getBudgetCategories().subscribe((budgetCategories: Array<BudgetCategory>) => this.budgetCategories = budgetCategories);
    this.nextStepPath = requestService.getNextStep(currentStepPath);
    this.prevStepPath = requestService.getPrevStep(currentStepPath);
    requestService.stepVisited(currentStepPath);
  }

  save(): void {
    for (const controlName in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(controlName)) {
        this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
      }
    }
    const selectedBudgetCategory = this.budgetCategories.find(bc => bc.id === this.formGroup.controls['budgetCategory'].value);
    if (selectedBudgetCategory) { this.requestService.setProperty('budgetCategoryName', selectedBudgetCategory.name); }
  }

}
