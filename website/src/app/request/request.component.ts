import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService as SocialAuthService } from 'angularx-social-login';
import { LoginDialogComponent } from '../shared/components/login-dialog/login-dialog.component';
import { Country } from '../shared/models/country.model';
import { RequestService } from './request.service';

@Component({
	selector: 'c-request',
	templateUrl: './request.component.html',
	styleUrls: ['./request.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class RequestComponent implements OnInit, OnDestroy {
	firstTimeLogin = true;
	countries: Array<Country> = [];
	selectedCountriesIso: Array<string> = [];

	constructor(
		private requestService: RequestService,
		private activatedRoute: ActivatedRoute,
		private socialAuthService: SocialAuthService,
		private dialog: MatDialog
	) {
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

	ngOnInit() {
		this.socialAuthService.authState.subscribe(user => {
			if (user) {
				this.requestService.setProperty('socialSigning', true);
				this.requestService.setProperty('travelerName', user.name);
				this.requestService.setProperty('travelerEmail', user.email);
			} else {
				if (this.firstTimeLogin) {
					this.openLoginDialog();
				}
			}
			this.firstTimeLogin = false;
		});
	}

	openLoginDialog(): void {
		this.dialog.open(LoginDialogComponent, {
			autoFocus: true,
			maxWidth: 400,
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
