import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
	private endPoint = 'users';
	private userPlansEndPoint = 'requests/users/requests';

	private userPlans: any = [];

	constructor(private http: HttpClient) {}

	update(user: User) {
		this.http.put(this.endPoint, user);
	}

	getUserPlans(): Observable<Array<any>> {
		return of(this.userPlans);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}

	getUserBookings(): Observable<Array<any>> {
		return this.http.get<Array<any>>(`${this.userPlansEndPoint}`);
	}
}
