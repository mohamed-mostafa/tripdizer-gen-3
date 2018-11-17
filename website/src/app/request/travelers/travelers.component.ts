import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-travelers',
  templateUrl: './travelers.component.html',
  styleUrls: ['./travelers.component.scss']
})
export class TravelersComponent {
  nextStepPath: string;
  prevStepPath: string;
  formGroup: FormGroup;
  controls: any = {
    'adultsNumber': new FormControl('', [Validators.required]),
    'kidsNumber': new FormControl(),
    'infantsNumber': new FormControl()
  };
  radioValuesStart: any = {
    adultsNumber: 0,
    kidsNumber: 0,
    infantsNumber: 0
  };

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
  }

  getRadioValues(controlName: string): Array<number> {
    return [1, 2, 3, 4].map(val => this.radioValuesStart[controlName] + val);
  }

  setRadioValuesStart(controlName: string, isFirst = false, isLast = false): void {
    const increaseBy = 2;
    if (isFirst && this.radioValuesStart[controlName] >= increaseBy) {
      this.radioValuesStart[controlName] -= increaseBy;
    }
    if (isLast) {
      this.radioValuesStart[controlName] += increaseBy;
    }
  }

  clearValueIfDoubleClicked(controlName: string, newControlValue): void {
    if (newControlValue === this.formGroup.controls[controlName].value) {
      setTimeout(() => { (this.controls[controlName] as FormControl).setValue(0); }, 1);
    }
  }

}
