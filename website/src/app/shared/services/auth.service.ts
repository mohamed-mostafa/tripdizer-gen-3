import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	AuthService as SocialAuthService,
	AuthServiceConfig,
	FacebookLoginProvider,
	GoogleLoginProvider,
	LinkedInLoginProvider,
	SocialUser,
} from 'angularx-social-login';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { TrackingService } from './tracking.service';

declare const FB: any;

@Injectable({ providedIn: 'root' })
export class AuthService {
	private endPoint = 'users/auth';
	authenticatedUser = new Subject<User>();
	isAuthenticated = new Subject<boolean>();

	constructor(
		private http: HttpClient,
		private socialAuthService: SocialAuthService,
		private trackingService: TrackingService
	) {
		setTimeout(() => {
			this.initAuthenticationState();
		}, 0);
	}

	signInWithGoogle(): void {
		this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
			this.authenticateUserServerSide(user.provider, user.idToken);
		});
	}

	signInWithFacebook(): void {
		this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
			this.authenticateUserServerSide(user.provider, user.authToken);
		});
	}

	signInWithLinkedIn(): void {
		this.socialAuthService.signIn(LinkedInLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
			this.authenticateUserServerSide(user.provider, user.idToken);
		});
	}

	continueWithoutLogin(): void {
		this.trackingService.track('Continue without login');
	}

	signOut(): void {
		this.socialAuthService.signOut();
		localStorage.removeItem('cred');
		this.isAuthenticated.next(false);
		this.authenticatedUser.next(null);
		this.trackingService.track('Sign out');
	}

	private authenticateUserServerSide(provider: string, token: string): void {
		this.trackingService.track(`${provider} client-side authentication`);
		this.http
			.get(`/${this.endPoint}/${provider}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.subscribe((user: User) => {
				this.storeAuthenticatedUser(user);
				this.trackingService.track(`${provider} back-end authentication`, user);
			});
	}

	private signInWithProvider(provider: string): void {
		switch (provider) {
			case 'facebook':
				this.signInWithFacebook();
				break;
			case 'google':
				this.signInWithGoogle();
				break;
			case 'linkedin':
				this.signInWithLinkedIn();
				break;
			default:
				this.continueWithoutLogin();
				break;
		}
	}

	private storeAuthenticatedUser(user: User): void {
		this.setAuthenticatedUserInLocalStorage(user);
		this.initAuthenticationState();
	}

	private setAuthenticatedUserInLocalStorage(user: User): void {
		localStorage.setItem('cred', JSON.stringify({ token: user.token }));
		localStorage.setItem(
			'user',
			JSON.stringify({
				firstName: user.firstName,
				lastName: user.lastName,
				picture: user.picture,
				provider: user.provider,
			})
		);
	}

	private initAuthenticationState(): void {
		const credentials = localStorage.getItem('cred');
		if (credentials) {
			const parsedCred = JSON.parse(credentials);
			const user = localStorage.getItem('user');
			if (parsedCred && user) {
				const parsedUser: User = JSON.parse(user);
				const tokenExpired = false;
				if (!tokenExpired) {
					this.isAuthenticated.next(!!parsedUser.firstName);
					this.authenticatedUser.next(parsedUser);
				} else if (tokenExpired && parsedUser.provider) {
					this.signInWithProvider('facebook');
				}
			}
		}
	}
}

export function SocialAuthServiceConfig() {
	return new AuthServiceConfig([
		{
			id: GoogleLoginProvider.PROVIDER_ID,
			provider: new GoogleLoginProvider(environment.google.OAuthID),
		},
		{
			id: FacebookLoginProvider.PROVIDER_ID,
			provider: new FacebookLoginProvider(environment.facebook.appID),
		},
	]);
}
