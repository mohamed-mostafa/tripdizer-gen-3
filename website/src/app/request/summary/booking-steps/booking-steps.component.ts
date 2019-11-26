import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'c-booking-steps',
	templateUrl: './booking-steps.component.html',
	styleUrls: ['./booking-steps.component.scss'],
})
export class BookingStepsComponent implements OnInit {
	formGroup = new FormGroup({});

	constructor() {}

	ngOnInit() {}
}
