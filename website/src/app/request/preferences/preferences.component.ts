import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { Preference } from './preference.model';

@Component({
  selector: 'c-request-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent {
  nextStepPath: string;
  prevStepPath: string;
  formGroup: FormGroup;
  controls: any = {};
  preferences: Array<Preference>;

  constructor(
    route: ActivatedRoute,
    private requestService: RequestService
  ) {
    const currentStepPath = route.routeConfig.path;
    this.formGroup = new FormGroup({});
    requestService.getPreferences().subscribe((preferences: Array<Preference>) => {
      this.preferences = preferences;
      this.preferences.forEach(preference => {
        this.controls[preference.id] = new FormControl();
      });
      for (const controlName in this.controls) {
        if (this.controls.hasOwnProperty(controlName)) {
          (this.controls[controlName] as FormControl).setValue(this.requestService.isPreferenceSelected(controlName));
          this.formGroup.addControl(controlName, this.controls[controlName]);
        }
      }
    });
    this.nextStepPath = requestService.getNextStep(currentStepPath);
    this.prevStepPath = requestService.getPrevStep(currentStepPath);
    requestService.stepVisited(currentStepPath);
  }

  save(): void {
    this.requestService.resetPreference();
    for (const controlName in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(controlName)) {
        if (this.formGroup.controls[controlName].value) {
          const selectedPreference = this.preferences.find(preference => (preference.id).toString() === controlName);
          this.requestService.addPreference(selectedPreference);
        }
      }
    }
  }

}
