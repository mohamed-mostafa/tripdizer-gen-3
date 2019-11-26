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
}
