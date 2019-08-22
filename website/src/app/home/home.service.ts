import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';

@Injectable({ providedIn: 'root' })
export class HomeService {
	private endPoint = 'master-data/public';
	private temporaryJsonBinEndPoint = 'https://api.jsonbin.io/b';

	constructor(private http: HttpClient, private requestService: RequestService) { }

	savePhoneNumber(phoneNumber: number): void {
		this.http.post<void>(`${this.endPoint}/phone`, { phoneNumber }).subscribe(() => { });
	}

	saveSuggestedCountry(data: any): void {
		this.setIsLoading(true, 'Submitting data ...');
		this.http.post<void>(`${this.temporaryJsonBinEndPoint}`, { data }).subscribe(res => {
			this.setIsLoading(false, '');
			console.log(res);
		});
	}

	setIsLoading(isLoading: boolean, message: string) {
		this.requestService.isLoading.next({ show: isLoading, message: message });
	}
}
