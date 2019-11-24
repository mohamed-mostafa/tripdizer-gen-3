import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RequestService } from '../../request.service';

@Component({
	selector: 'c-request-travellers-info',
	templateUrl: './travellers-info.component.html',
	styleUrls: ['./travellers-info.component.scss'],
})
export class TravellersInfoComponent implements OnInit {
	@Input() formGroup: FormGroup;
	adultsNumber: number;
	kidsNumber: number;
	infantsNumber: number;

	constructor(private requestService: RequestService) {
		this.adultsNumber = this.requestService.getProperty<number>('adultsNumber');
		this.kidsNumber = this.requestService.getProperty<number>('kidsNumber');
		this.infantsNumber = this.requestService.getProperty<number>('infantsNumber');
	}

	ngOnInit() {}

	arrOfN(n: number): Array<number> {
		return Array.from(Array(n).keys());
	}

	goToNextStep() {
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
		travellers.adults = Object.values(travellers.adults).map(adult => adult);
		travellers.kids = Object.values(travellers.kids).map(kid => kid);
		travellers.infants = Object.values(travellers.infants).map(infant => infant);
		this.requestService.setProperty('travellers', travellers);
	}
}
