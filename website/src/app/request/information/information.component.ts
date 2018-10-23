import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateValidators, NumberValidators } from 'src/app/shared/utils';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  currentStepPath: string;
  formGroup: FormGroup;
  controls: any = {
    'travelerName': new FormControl('', [Validators.required]),
    'travelerMobile': new FormControl('', [Validators.required, NumberValidators.numericOnly()]),
    'travelerEmail': new FormControl('', [Validators.required, Validators.email]),
    'travelerBirthday': new FormControl('', [Validators.required, DateValidators.valid()]),
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService
  ) {
    this.formGroup = new FormGroup({});
    for (const controlName in this.controls) {
      if (this.controls.hasOwnProperty(controlName)) {
        (this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
        this.formGroup.addControl(controlName, this.controls[controlName]);
      }
    }
    this.currentStepPath = this.route.routeConfig.path;
    requestService.stepVisited(this.currentStepPath);
  }

  save(): boolean {
    if (this.formGroup.invalid) { return false; }

    for (const controlName in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(controlName)) {
        this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
      }
    }
    return true;
  }

  goToPrevStep() {
    this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
  }

  goToNextStep() {
    if (this.save()) { this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route }); }
  }
}
