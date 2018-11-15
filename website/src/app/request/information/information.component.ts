import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'src/app/shared/utils';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  nextStepPath: string;
  prevStepPath: string;
  formGroup: FormGroup;
  controls: any = {
    'travelerName': new FormControl('', [Validators.required]),
    'travelerMobile': new FormControl('', [Validators.required, CustomValidators.numericOnly()]),
    'travelerEmail': new FormControl('', [Validators.required, Validators.email]),
    'travelerEmailConfirmation': new FormControl('', [CustomValidators.equalTo('travelerEmail', 'Email doesn\'t match')]),
    'travelerBirthday': new FormControl('', [Validators.required, CustomValidators.dateValid()]),
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

}
