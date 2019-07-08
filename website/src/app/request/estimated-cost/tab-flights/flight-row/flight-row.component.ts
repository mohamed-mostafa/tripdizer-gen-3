import { Component, Input } from '@angular/core';
import { Flight } from '../flight.model';

@Component({
	selector: 'c-estimated-cost-flight-row',
	templateUrl: './flight-row.component.html',
	styleUrls: ['./flight-row.component.scss'],
})
export class FlightRowComponent {
	@Input() flight: Flight;
	@Input() index: number;
	@Input() isEven: boolean;
	@Input() isFirst: boolean;
	@Input() isLast: boolean;
}
