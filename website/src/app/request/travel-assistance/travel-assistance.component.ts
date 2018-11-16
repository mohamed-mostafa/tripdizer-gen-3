import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-travel-assistance',
  templateUrl: './travel-assistance.component.html',
  styleUrls: ['./travel-assistance.component.scss']
})
export class TravelAssistanceComponent {
  nextStepPath: string;
  prevStepPath: string;
  formGroup: FormGroup;
  controls: any = {
    'visaAssistanceNeeded': new FormControl(),
    'tourGuideNeeded': new FormControl(),
    'specialRequests': new FormControl()
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
