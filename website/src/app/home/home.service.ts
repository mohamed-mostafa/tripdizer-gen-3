import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';

export interface CountryRequest {
	name: string;
	country: string;
	phone: string;
	email: string;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
	private endPoint = 'master-data/public';

	constructor(private http: HttpClient, private requestService: RequestService) { }

	saveCountryRequest(countryRequest: CountryRequest): void {
		this.setIsLoading(true, 'Submitting data ...');
		this.http.post<void>(`${this.endPoint}/country-request`, { countryRequest }).subscribe(res => {
			this.setIsLoading(false, '');
			console.log(res);
		});
	}

	setIsLoading(isLoading: boolean, message: string) {
		this.requestService.isLoading.next({ show: isLoading, message: message });
	}
}
