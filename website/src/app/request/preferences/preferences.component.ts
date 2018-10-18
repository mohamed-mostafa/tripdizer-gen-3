import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  formGroup: FormGroup;
  controls: any = {};
  preferences: Array<Preference>;

  constructor(
    private router: Router,
    private requestService: RequestService
  ) {
    this.formGroup = new FormGroup({});
    requestService.getPreferences('EN')
      .subscribe((preferences: Array<Preference>) => {
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
  }

  save(): boolean {
    if (this.formGroup.invalid) { return false; }

    this.requestService.resetPreference();
    for (const controlName in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(controlName)) {
        if (this.formGroup.controls[controlName].value) {
          const selectedPreference = this.preferences.find(preference => (preference.id).toString() === controlName);
          this.requestService.addPreference(selectedPreference);
        }
      }
    }
    return true;
  }

  goToNextStep() {
    if (this.save()) { this.router.navigate(['request', 'destinations']); }
  }

}
