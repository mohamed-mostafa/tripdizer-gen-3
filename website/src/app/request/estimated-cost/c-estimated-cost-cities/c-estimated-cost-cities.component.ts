import { DomSanitizer } from '@angular/platform-browser';
import { CitiesService } from './cities.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'c-estimated-cost-cities',
	templateUrl: './c-estimated-cost-cities.component.html',
	styleUrls: ['./c-estimated-cost-cities.component.scss']
})
export class CitiesComponent implements OnInit {

	cities: Array<any> = [];

	constructor(
		service: CitiesService,
		public sanitizer: DomSanitizer
	) {
		service.getCities().subscribe(cities => {
			this.cities = cities;
			console.log(this.cities);
		});
	}

	ngOnInit() {
	}

}
