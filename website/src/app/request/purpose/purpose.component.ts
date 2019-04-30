import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/* Services */
import { MixpanelService } from '../../shared/services/mixpanel.service';
import { RequestService } from '../request.service';

/* Models */
import { Purpose, LUTPurpose } from './purpose.model';

@Component({
	selector: 'c-request-purpose',
	templateUrl: './purpose.component.html',
	styleUrls: ['./purpose.component.scss'],
})
export class PurposeComponent {
	formGroup: FormGroup;
	controls: any = {
		purpose: new FormControl('', [Validators.required]),
	};
	purposes: Array<Purpose>;
	LUTPurpose = LUTPurpose;
	otherPurposeName = '';

	constructor(private requestService: RequestService, private mixpanelService: MixpanelService) {
		this.formGroup = new FormGroup({});
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				if (this.requestService.getProperty(controlName) === LUTPurpose.Other) {
					this.otherPurposeName = this.requestService.getProperty('purposeName');
				}
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
		requestService.getPurposes().subscribe((purposes: Array<Purpose>) => (this.purposes = purposes));
	}

	otherPurposeFocused(): void {
		this.formGroup.get('purpose').setValue(LUTPurpose.Other);
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
			}
		}
		const selectedPurpose = this.purposes.find(p => p.id === this.formGroup.controls['purpose'].value);
		if (selectedPurpose) {
			if (selectedPurpose.id === LUTPurpose.Other) {
				selectedPurpose.name = this.otherPurposeName;
			}
			this.requestService.setProperty('purposeName', selectedPurpose.name);
			this.requestService.setProperty('adultsNumber', selectedPurpose.adultsNumber);
			this.requestService.setProperty('kidsNumber', selectedPurpose.kidsNumber);
			this.requestService.setProperty('infantsNumber', selectedPurpose.infantsNumber);
		}
		this.mixpanelService.track('Submit - Purpose', { ...this.formGroup.value, purposeName: selectedPurpose.name });
	}
}
