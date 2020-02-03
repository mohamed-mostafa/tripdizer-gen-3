import { AuthService } from './../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
	private endPoint = 'users';
	user: User;

	constructor(private http: HttpClient, private authService: AuthService) {
		this.authService.authenticatedUser.subscribe($user => {
			console.log($user);
			this.user = $user;
			console.log(this.user);
		});
	}

	update(user: User) {
		this.http.put(this.endPoint, user);
	}
}
