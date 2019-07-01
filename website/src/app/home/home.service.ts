import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HomeService {
	private endPoint = 'master-data/public';

	constructor(private http: HttpClient) {}

	savePhoneNumber(phoneNumber: number): void {
		this.http.post<void>(`${this.endPoint}/phone`, { phoneNumber }).subscribe(() => {});
	}
}
