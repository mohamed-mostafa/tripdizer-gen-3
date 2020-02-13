import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserPlan } from './user-plans/user-plan.model';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
	private endPoint = 'users';
	private userBookingsEndpoint = 'requests/users/requests';

	private userPlans: Array<UserPlan> = [];

	constructor(private http: HttpClient) {}

	update(user: User) {
		this.http.put(this.endPoint, user);
	}

	getUserPlans(): Observable<Array<UserPlan>> {
		return of(this.userPlans);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}

	getUserBookings(): Observable<Array<any>> {
		return this.http.get<Array<any>>(`${this.userBookingsEndpoint}`);
	}
}
