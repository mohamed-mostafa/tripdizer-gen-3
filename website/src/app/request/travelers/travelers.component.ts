import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DateValidators } from '../../shared/utils';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-travelers',
  templateUrl: './travelers.component.html',
  styleUrls: ['./travelers.component.scss']
})
export class TravelersComponent {
  formGroup: FormGroup;
  controls: any = {
    'adultsNumber': new FormControl('', [Validators.required]),
    'kidsNumber': new FormControl(),
    'infantsNumber': new FormControl()
  };
  radioValues = {
    1: '1',
    2: '2',
    3: '3',
    4: '+4'
  };

  constructor(
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

  goToNextStep() {
    if (this.save()) { this.router.navigate(['request', 'budget']); }
  }
}
