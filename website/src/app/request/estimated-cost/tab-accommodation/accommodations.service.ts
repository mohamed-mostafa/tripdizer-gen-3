import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class HotelsService {
	private endPoint = 'package-options/1.0.0/accomodationOffers' /*+ (lang ? '?lang=' + lang : '')*/;

	constructor(private http: HttpClient) { }

	getHotels(): Observable<Array<any>> {
		return this.http.post<Array<any>>(`${this.endPoint}/search`, {
			'arrival': '2019-10-20',
			'budgetCategory': 'SUPER ECONOMY',
			'cities': [
				{
					'cityIata': 'AMS',
					'numberOfNights': 2
				},
				{
					'cityIata': 'CDG',
					'numberOfNights': 3
				}
			]
		});
	}
}
