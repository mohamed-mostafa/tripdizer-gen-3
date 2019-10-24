import { SocialUser } from 'angularx-social-login';

export class User {
	email: string;
	firstName: string;
	lastName: string;
	picture: string;
	phone: string;
	location: string;
	provider: string;
	token?: string;

	get name(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	constructor(socialUser: SocialUser) {
		this.email = socialUser.email;
		this.firstName = socialUser.firstName;
		this.lastName = socialUser.lastName;
		this.picture = socialUser.photoUrl;
		this.provider = socialUser.provider;
	}
}
