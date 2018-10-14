import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DateValidators } from '../../shared/utils';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-departure-return',
  templateUrl: './departure-return.component.html',
  styleUrls: ['./departure-return.component.scss']
})
export class DepartureReturnComponent {
  formGroup: FormGroup;
  controls: any = {
    'departureDate': new FormControl('', [Validators.required, DateValidators.valid()]),
    'returnDate': new FormControl('', [Validators.required, DateValidators.valid()]),
    'isFlexibleDates': new FormControl()
  };

  constructor(
    private router: Router,
    private requestService: RequestService
  ) {
    this.formGroup = new FormGroup({}, {
      validators: DateValidators.greaterThan('departureDate', 'returnDate', 'Return Date must be greater than departure date')
    });
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
    if (this.save()) { this.router.navigate(['request', 'travelers']); }
  }
}
