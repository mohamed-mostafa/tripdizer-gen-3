import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CountryRequest {
	name: string;
	country: string;
	phone: string;
	email: string;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
	private endPoint = 'master-data/public';

	constructor(private http: HttpClient) { }

	saveCountryRequest(countryRequest: CountryRequest): Observable<any> {
		return this.http.post<void>(`${this.endPoint}/country-request`, countryRequest);
	}


}
