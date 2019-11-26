import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RequestService } from '../../request.service';

@Component({
	selector: 'c-booking-steps',
	templateUrl: './booking-steps.component.html',
	styleUrls: ['./booking-steps.component.scss'],
})
export class BookingStepsComponent implements OnInit {
	formGroup = new FormGroup({});

	constructor(private requestService: RequestService) {}

	ngOnInit() {}

	goToPaymentStep() {
		const travellers = { adults: {}, kids: {}, infants: {} };
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				if (this.formGroup.controls[controlName].value) {
					const info = controlName.match(/(adult|kid|infant)-([0-9]+)-(.+)/);
					if (info) {
						const type = info[1];
						const number = info[2];
						const control = info[3];
						travellers[`${type}s`] = travellers[`${type}s`] || {};
						travellers[`${type}s`][number] = travellers[`${type}s`][number] || {};
						travellers[`${type}s`][number][control] = this.formGroup.controls[controlName].value;
					}
				}
			}
		}
		const adults = Object.values(travellers.adults).map(adult => ({ ...adult, ageGroup: 'adult' }));
		const kids = Object.values(travellers.kids).map(kid => ({ ...kid, ageGroup: 'kid' }));
		const infants = Object.values(travellers.infants).map(infant => ({ ...infant, ageGroup: 'infant' }));
		this.requestService.setProperty('travellers', adults.concat(kids).concat(infants));
		this.requestService.submitRequest(true).subscribe((response: any) => {
			if (response) {
				console.log(response);
			} else {
			}
		});
	}
}
