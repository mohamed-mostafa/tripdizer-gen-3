import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CityDTO } from './city-dto.model';

@Injectable({ providedIn: 'root' })
export class CitiesService {
	private endPoint = 'package-options/1.0.0/countryCities' /*+ (lang ? '?lang=' + lang : '')*/;

	constructor(private http: HttpClient) { }

	getCities(): Observable<Array<CityDTO>> {
		// return of(this.cities);
		return this.http.post<Array<any>>(`${this.endPoint}/search`, { 'countries': [ 'NLD', 'ITA', 'FRA' ] });
	}
}
