import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RequestService } from '../../../../request/request.service';

@Component({
	selector: 'c-request-booking-travellers-info-step',
	templateUrl: './travellers-info-step.component.html',
	styleUrls: ['./travellers-info-step.component.scss'],
})
export class BookingTravellersInfoComponent implements OnInit {
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
}
