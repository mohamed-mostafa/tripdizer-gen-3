import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Country } from '../shared/models/country.model';
import { RequestService } from './request.service';

@Component({
	selector: 'c-request',
	templateUrl: './request.component.html',
	styleUrls: ['./request.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class RequestComponent implements OnDestroy {
	countries: Array<Country> = [];
	selectedCountriesIso: Array<string> = [];
	constructor(private requestService: RequestService, private activatedRoute: ActivatedRoute) {
		requestService.getCountries().subscribe(countries => {
			this.countries = countries;
			this.setPreSelectedCountries();
		});

		this.activatedRoute.queryParams.subscribe(params => {
			if (params['countries']) {
				this.selectedCountriesIso = Array.isArray(params['countries']) ? params['countries'] : [params['countries']];
				this.setPreSelectedCountries();
			}
		});
	}

	setPreSelectedCountries(): void {
		if (!this.countries.length || !this.selectedCountriesIso.length) {
			return;
		}
		const selectedCountries: Array<Country> = this.selectedCountriesIso
			.map(sd => {
				const selectedCountry = this.countries.find(d => d.ISOCode === sd);
				return Boolean(selectedCountry) ? selectedCountry : null;
			})
			.filter(sd => Boolean(sd));
		this.requestService.setProperty('countries', selectedCountries);
	}

	ngOnDestroy() {
		this.requestService.resetRequestState();
	}
}
