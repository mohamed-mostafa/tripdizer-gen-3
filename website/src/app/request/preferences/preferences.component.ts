import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

/* Services */
import { MixpanelService } from '../../shared/services/mixpanel.service';
import { RequestService } from '../request.service';

/* Models */
import { Preference } from './preference.model';

@Component({
	selector: 'c-request-preferences',
	templateUrl: './preferences.component.html',
	styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent {
	formGroup: FormGroup;
	controls: any = {};
	preferences: Array<Preference>;

	constructor(private requestService: RequestService, private mixpanelService: MixpanelService) {
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
	}

	save(): void {
		this.requestService.resetPreference();
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				if (this.formGroup.controls[controlName].value) {
					const selectedPreference = this.preferences.find(preference => preference.id.toString() === controlName);
					this.requestService.addPreference(selectedPreference);
				}
			}
		}
		this.mixpanelService.track('Submit - Preferences', this.formGroup.value);
	}
}
