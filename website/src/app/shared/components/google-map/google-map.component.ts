import { LatLng } from '@agm/core';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'c-shared-google-map',
	templateUrl: './google-map.component.html',
	styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent {
	@Input() height = 300;
	@Input() paths: Array<LatLng>;
}
