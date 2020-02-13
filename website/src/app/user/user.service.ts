import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
	private endPoint = 'users';
	private userPlansEndPoint = 'requests/users/requests';

	private userPlans: any = [];

	private userBookings: Array<any> = [
		{
			id: 6561,
			name: 'France, Greece',
			departureDate: 'Thu Feb 20 2020 00:00:00 GMT+0200 (Eastern European Standard Time)',
			returnDate: 'Fri Feb 28 2020 00:00:00 GMT+0200 (Eastern European Standard Time)',
			clickable: true,
			countries: [
				{
					name: 'France',
					numberOfNights: 2,
					image: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/ATH.png',
					cities: [
						{
							name: 'Paris',
							numberOfNights: 2,
						},
					],
				},
				{
					name: 'Greece',
					numberOfNights: 2,
					image: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/ATH.png',
					cities: [
						{
							name: 'Athens',
							numberOfNights: 2,
						},
					],
				},
			],
			totalCost: 424401,
			numberOfNights: 9,
		},
		{
			id: 6561,
			name: 'France, Greece',
			departureDate: 'Thu Feb 20 2020 00:00:00 GMT+0200 (Eastern European Standard Time)',
			returnDate: 'Fri Feb 28 2020 00:00:00 GMT+0200 (Eastern European Standard Time)',
			clickable: true,
			countries: [
				{
					name: 'France',
					numberOfNights: 2,
					image: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/ATH.png',
					cities: [
						{
							name: 'Paris',
							image: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/ATH.png',
							numberOfNights: 2,
						},
					],
				},
				{
					name: 'Greece',
					numberOfNights: 2,
					image: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/ATH.png',
					cities: [
						{
							name: 'Athens',
							image: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/ATH.png',
							numberOfNights: 2,
						},
					],
				},
			],
			totalCost: 424401,
			numberOfNights: 9,
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
		// return of(this.userBookings);
		return this.http.get<Array<any>>(`${this.userPlansEndPoint}`);
	}
}
