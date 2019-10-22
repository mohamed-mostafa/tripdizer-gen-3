import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
	private endPoint = 'users';

	constructor(private http: HttpClient) {}

	update(user: User) {
		this.http.put(this.endPoint, user);
	}
}
