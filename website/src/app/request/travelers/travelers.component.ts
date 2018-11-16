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
  radioValues: Array<{ key: number, value: string }> = [
    { key: 1, value: '1' },
    { key: 2, value: '2' },
    { key: 3, value: '3' },
    { key: 4, value: '+4' }
  ];

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

  clearValueIfDoubleClicked(controlName: string, newControlValue): void {
    if (newControlValue === this.formGroup.controls[controlName].value) {
      setTimeout(() => { (this.controls[controlName] as FormControl).setValue(0); }, 1);
    }
  }

}
