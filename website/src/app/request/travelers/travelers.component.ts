import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/* Services */
import { RequestService } from '../request.service';

@Component({
	selector: 'c-request-travelers',
	templateUrl: './travelers.component.html',
	styleUrls: ['./travelers.component.scss'],
})
export class TravelersComponent {
	formGroup: FormGroup;
	controls: any = {
		adultsNumber: new FormControl('', [Validators.required]),
		kidsNumber: new FormControl(),
		infantsNumber: new FormControl(),
	};

	constructor(private requestService: RequestService) {
		this.formGroup = new FormGroup({});
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
			}
		}
	}

	getRadioValues(controlName: string): Array<number> {
		return [1, 2, 3, 4].map(val => this.requestService.getTravelersRadioButtonsStart(controlName) + val);
	}

	setRadioValuesStart(controlName: string, isFirst = false, isLast = false): void {
		const times = 2;
		this.calcRadioValuesStartWithAnimation(
			controlName,
			times,
			isLast,
			isFirst && this.requestService.getTravelersRadioButtonsStart(controlName) >= times
		);
	}

	calcRadioValuesStartWithAnimation(controlName, counter, increase, decrease) {
		if (counter <= 0) {
			return;
		}
		setTimeout(() => {
			this.requestService.setTravelersRadioButtonsStart(controlName, increase, decrease);
			this.calcRadioValuesStartWithAnimation(controlName, --counter, increase, decrease);
		}, 100);
	}

	clearValueIfDoubleClicked(controlName: string, newControlValue): void {
		if (newControlValue === this.formGroup.controls[controlName].value) {
			setTimeout(() => {
				(this.controls[controlName] as FormControl).setValue(0);
			}, 1);
		}
	}
}
