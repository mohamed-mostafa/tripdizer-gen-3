import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
	private endPoint = 'users';
	private userPlansEndPoint = '';

	private userPlans: Array<any> = [
		{
			days_count: 10,
			country_name: 'GREEK',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/greek.jpg'
		},
		{
			days_count: 10,
			country_name: 'FRANCE',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/france.jpg'
		},
		{
			days_count: 10,
			country_name: 'ITALY',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/italy.jpg'
		},
		{
			days_count: 10,
			country_name: 'SPAIN',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/spain.jpg'
		},
	];


	private userBookings: Array<any> = [
		{
			days_count: 10,
			country_name: 'GREEK',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/greek.jpg'
		},
		{
			days_count: 10,
			country_name: 'FRANCE',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/france.jpg'
		},
		{
			days_count: 10,
			country_name: 'ITALY',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/italy.jpg'
		},
		{
			days_count: 10,
			country_name: 'SPAIN',
			from: '22-6-2019',
			to: '1-7-2019',
			image: '../../../assets/img/towns/spain.jpg'
		},
	];

	constructor(private http: HttpClient) {}

	update(user: User) {
		this.http.put(this.endPoint, user);
	}

	getUserPlans(): Observable<Array<any>> {
		return of(this.userPlans);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}

	getUserBookings(): Observable<Array<any>> {
		return of(this.userBookings);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}
}
