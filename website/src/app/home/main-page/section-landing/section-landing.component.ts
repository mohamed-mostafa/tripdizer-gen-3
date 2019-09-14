import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Country } from 'src/app/shared/models/country.model';
import { LookupsService } from 'src/app/shared/services/lookups.service';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'c-home-section-landing',
	templateUrl: './section-landing.component.html',
	styleUrls: ['./section-landing.component.scss'],
})
export class SectionLandingComponent {
	selectedCountries: Array<Country> = [];

	countries: Observable<Array<Country>>;

	get selectedCountriesISO(): Array<string> {
		return this.selectedCountries.map(c => c.ISOCode);
	}

	constructor(
		private router: Router,
		private trackingService: TrackingService,
		lutService: LookupsService,
		public translate: TranslateService
	) {
		this.countries = lutService.getValidCountries();

		this.translate.onLangChange.subscribe(() => (this.countries = lutService.getValidCountries()));
	}

	havePlan() {
		this.trackingService.track('Submit - Yes, I have a plan');

		this.router.navigate(['request'], { queryParams: { countries: this.selectedCountriesISO } });
	}

	surpriseMe() {
		this.trackingService.track('Submit - NO, Surprise me');

		this.router.navigate(['request'], { queryParams: { countries: this.selectedCountriesISO, surprise: true } });
	}
}
