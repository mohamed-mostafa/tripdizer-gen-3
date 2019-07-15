import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from 'src/app/shared/models/country.model';

@Injectable({
	providedIn: 'root',
})
export class SectionLandingService {
	private endPoint = 'master-data';

	constructor(private http: HttpClient) {}

	getCountries(): Observable<Array<Country>> {
		return this.http.get<Array<any>>(`${this.endPoint}/countries`);
	}
}
