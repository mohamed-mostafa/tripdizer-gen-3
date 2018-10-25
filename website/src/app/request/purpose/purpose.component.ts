import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { Purpose } from './purpose.model';

@Component({
  selector: 'c-request-purpose',
  templateUrl: './purpose.component.html',
  styleUrls: ['./purpose.component.scss']
})
export class PurposeComponent {
  currentStepPath: string;
  formGroup: FormGroup;
  controls: any = {
    'purpose': new FormControl('', [Validators.required]),
  };
  purposes: Array<Purpose>;

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
    requestService.getPurposes().subscribe((purposes: Array<Purpose>) => this.purposes = purposes);
  }

  save(): boolean {
    if (this.formGroup.invalid) { return false; }

    for (const controlName in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(controlName)) {
        this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
      }
    }
    const selectedPurpose = this.purposes.find(p => p.id === this.formGroup.controls['purpose'].value);
    if (selectedPurpose) { this.requestService.setProperty('purposeName', selectedPurpose.name); }
    return true;
  }

  goToPrevStep() {
    this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
  }

  goToNextStep() {
    if (this.save()) { this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route }); }
  }

}
