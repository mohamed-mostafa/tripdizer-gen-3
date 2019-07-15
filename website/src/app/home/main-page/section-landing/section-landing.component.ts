import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Country } from 'src/app/shared/models/country.model';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { SectionLandingService } from './section-landing.service';

@Component({
	selector: 'c-home-section-landing',
	templateUrl: './section-landing.component.html',
	styleUrls: ['./section-landing.component.scss'],
})
export class SectionLandingComponent {
	_selectedCountries: Array<Country> = [];

	countries: Observable<Array<Country>>;

	get selectedCountries(): Array<string> {
		return this._selectedCountries.map(c => c.ISOCode);
	}

	constructor(private router: Router, private trackingService: TrackingService, service: SectionLandingService) {
		this.countries = service.getCountries();
	}

	countriesChanged(countries: Array<Country>): void {
		this._selectedCountries = countries;
	}

	havePlan() {
		this.trackingService.track('Submit - Yes, I have a plan');

		this.router.navigate(['request'], { queryParams: { countries: this.selectedCountries } });
	}

	surpriseMe() {
		this.trackingService.track('Submit - NO, Surprise me');

		this.router.navigate(['request'], { queryParams: { countries: this.selectedCountries, surprise: true } });
	}
}
