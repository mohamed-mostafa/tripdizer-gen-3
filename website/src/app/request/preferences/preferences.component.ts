import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TrackingService } from '../../shared/services/tracking.service';
import { RequestService } from '../request.service';
import { LUTPreference, Preference } from './preference.model';

@Component({
	selector: 'c-request-preferences',
	templateUrl: './preferences.component.html',
	styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent {
	formGroup: FormGroup;
	controls: any = {};
	preferences: Array<Preference>;
	LUTPreference = LUTPreference;
	otherPreferenceName = '';

	constructor(private requestService: RequestService, private trackingService: TrackingService) {
		this.formGroup = new FormGroup({});
		requestService.getPreferences().subscribe((preferences: Array<Preference>) => {
			this.preferences = preferences;
			this.preferences.forEach(preference => {
				this.controls[preference.id] = new FormControl();
			});
			for (const controlName in this.controls) {
				if (this.controls.hasOwnProperty(controlName)) {
					(this.controls[controlName] as FormControl).setValue(this.requestService.isPreferenceSelected(controlName));
					if (controlName === LUTPreference.Other.toString()) {
						this.otherPreferenceName = this.requestService.getPreferenceName(LUTPreference.Other.toString());
					}
					this.formGroup.addControl(controlName, this.controls[controlName]);
				}
			}
		});
	}

	otherPreferenceFocused(): void {
		this.formGroup.get(LUTPreference.Other.toString()).setValue(true);
	}

	save(): void {
		this.requestService.resetPreference();
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				if (this.formGroup.controls[controlName].value) {
					const selectedPreference = this.preferences.find(preference => preference.id.toString() === controlName);
					if (selectedPreference.id === LUTPreference.Other) {
						selectedPreference.name = this.otherPreferenceName;
					}
					this.requestService.addPreference(selectedPreference);
				}
			}
		}
		this.trackingService.track('Submit - Preferences', this.formGroup.value);
	}
}
