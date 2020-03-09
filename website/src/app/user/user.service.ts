import { LookupsService } from 'src/app/shared/services/lookups.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { UserBooking } from './user-booking/user-booking.model';
import { UserPlan } from './user-plans/user-plan.model';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
	private endPoint = 'users';
	private userBookingsEndpoint = 'requests/users/requests';
	isLoading = new Subject<{ show: boolean; message: string }>();

	private userPlans: Array<UserPlan> = [];

	constructor(private http: HttpClient, private authService: AuthService, private lutService: LookupsService) {
		this.isLoading = this.lutService.isLoading;
	}

	update(user: User) {
		this.isLoading.next({ show: true, message: 'Saving data ...' });
		return this.http.put(this.endPoint, user).pipe(
			tap((res: { success: boolean; data: User }) => {
				if (res.success) {
					this.authService.updateAuthenticatedUser(res.data);
					this.isLoading.next({
						show: false,
						message: '',
					});
				}
			})
		);
	}

	getUserPlans(): Observable<Array<UserPlan>> {
		return of(this.userPlans);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}

	getUserBookings(): Observable<Array<UserBooking>> {
		return this.http.get<Array<any>>(`${this.userBookingsEndpoint}`);
	}
}
