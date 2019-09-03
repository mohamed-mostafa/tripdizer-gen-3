import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BudgetCategory } from '../models/budget-category.model';
import { Country } from '../models/country.model';
import { DropDownItem } from '../models/drop-down-item.model';
import { LUTPreference, Preference } from '../models/preference.model';
import { LUTPurpose, Purpose } from '../models/purpose.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LookupsService {
	private endPoint = 'master-data';
	isLoading = new Subject<{ show: boolean; message: string }>();
	private lookups: {
		budgetCategories: Array<BudgetCategory>;
		countries: Array<Country>;
		referralTypes: Array<DropDownItem>;
		preferences: Array<Preference>;
		professions: Array<DropDownItem>;
		purposes: Array<Purpose>;
	} = {} as any;

	constructor(private http: HttpClient, translate: TranslateService) {
		translate.onLangChange.subscribe(() => (this.lookups = {} as any));
	}

	private getLookup<T>(endPoint: string, propName: string): Observable<Array<T>> {
		this.isLoading.next({ show: true, message: '' });
		let observable: Observable<Array<T>>;
		if (this.lookups[propName]) {
			observable = of(this.lookups[propName]);
			this.isLoading.next({ show: false, message: '' });
		} else {
			observable = this.http.get<Array<T>>(`${this.endPoint}/${endPoint}`);
		}
		return observable.pipe(
			tap(arr => {
				this.lookups[propName] = arr;
				this.isLoading.next({ show: false, message: '' });
			})
		);
	}

	getBudgetCategories(): Observable<Array<BudgetCategory>> {
		return this.getLookup('budget-categories', 'budgetCategories');
	}

	getCountries(): Observable<Array<Country>> {
		return this.getLookup('countries', 'countries');
	}

	getValidCountries(): Observable<Array<Country>> {
		return this.getCountries().pipe(map(arr => arr.filter(e => e.ISOCode)));
	}

	getCountriesWithoutOther(): Observable<Array<Country>> {
		return this.getCountries().pipe(map(arr => arr.filter(e => e.id !== -1)));
	}

	getReferralTypes(): Observable<Array<DropDownItem> | null> {
		return this.getLookup('referral-types', 'referralTypes');
	}

	getPreferences(): Observable<Array<Preference>> {
		return this.getLookup('interests', 'preferences');
	}

	getPreferencesWithoutOther(): Observable<Array<Preference>> {
		return this.getPreferences().pipe(map(arr => arr.filter(e => e.id !== LUTPreference.Other)));
	}

	removeCachedPreferences(): void {
		this.lookups.preferences = null;
	}

	getProfessions(): Observable<Array<DropDownItem> | null> {
		return this.getLookup('professions', 'professions');
	}

	getPurposes(): Observable<Array<Purpose>> {
		return this.getLookup('purposes', 'purposes');
	}

	getPurposesWithoutOther(): Observable<Array<Preference>> {
		return this.getPurposes().pipe(map(arr => arr.filter(e => e.id !== LUTPurpose.Other)));
	}

	removeCachedPurposes(): void {
		this.lookups.purposes = null;
	}
}
