import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

/* Services */
import { RequestService } from '../request.service';

@Component({
	selector: 'c-request-travel-assistance',
	templateUrl: './travel-assistance.component.html',
	styleUrls: ['./travel-assistance.component.scss'],
})
export class TravelAssistanceComponent {
	formGroup: FormGroup;
	controls: any = {
		visaAssistanceNeeded: new FormControl(),
		// tourGuideNeeded: new FormControl(),
		promoCode: new FormControl(),
		specialRequests: new FormControl(),
	};
	isValidPromoCode = false;
	isCheckingPromoCode = false;

	constructor(private requestService: RequestService) {
		this.formGroup = new FormGroup({});
		for (const controlName in this.controls) {
			if (this.controls.hasOwnProperty(controlName)) {
				(this.controls[controlName] as FormControl).setValue(this.requestService.getProperty(controlName));
				this.formGroup.addControl(controlName, this.controls[controlName]);
			}
		}
		this.applyPromoCode();
	}

	save(): void {
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName) && controlName !== 'promoCode') {
				this.requestService.setProperty(controlName, this.formGroup.controls[controlName].value);
			}
		}
	}

	applyPromoCode(): void {
		this.isCheckingPromoCode = true;
		this.formGroup.controls['promoCode'].disable();
		const promoCode = this.formGroup.controls['promoCode'].value;
		this.requestService.validatePromoCode(promoCode).subscribe(isValid => {
			this.isValidPromoCode = isValid;
			this.isCheckingPromoCode = false;
			this.formGroup.controls['promoCode'].enable();
			if (!isValid) {
				this.formGroup.controls['promoCode'].setValue('');
				this.formGroup.controls['promoCode'].setErrors({ invalidPromoCode: true });
				setTimeout(() => {
					this.formGroup.controls['promoCode'].reset();
				}, 1000);
			}
		});
	}
}
