import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from '../../shared/utils';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-departure-return',
  templateUrl: './departure-return.component.html',
  styleUrls: ['./departure-return.component.scss']
})
export class DepartureReturnComponent {
  nextStepPath: string;
  prevStepPath: string;
  formGroup: FormGroup;
  controls: any = {
    'departureDate': new FormControl('', [Validators.required, CustomValidators.dateValid()]),
    'returnDate': new FormControl('', [Validators.required, CustomValidators.dateValid()]),
    'isFlexibleDates': new FormControl()
  };

  constructor(
    route: ActivatedRoute,
    private requestService: RequestService
  ) {
    const currentStepPath = route.routeConfig.path;
    this.formGroup = new FormGroup({}, {
      validators: CustomValidators.dateGreaterThan('departureDate', 'returnDate', 'Return Date must be greater than departure date')
    });
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

}
