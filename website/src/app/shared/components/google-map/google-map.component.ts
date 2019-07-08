import { AgmMap, LatLng } from '@agm/core';
import { AfterViewChecked, Component, Input, ViewChild } from '@angular/core';

@Component({
	selector: 'c-shared-google-map',
	templateUrl: './google-map.component.html',
	styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements AfterViewChecked {
	private isVisible = false;

	@Input() height = 300;
	@Input() paths: Array<LatLng>;

	@ViewChild(AgmMap) public agmMap: AgmMap;

	ngAfterViewChecked() {
		if (this.isVisible === false && this.agmMap['_elem'].nativeElement.offsetParent !== null) {
			this.isVisible = true;
			this.agmMap.triggerResize();
		} else if (this.isVisible === true && this.agmMap['_elem'].nativeElement.offsetParent === null) {
			this.isVisible = false;
		}
	}
}
