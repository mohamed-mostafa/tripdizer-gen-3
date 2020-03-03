export class User {
	email: string;
	firstName: string;
	lastName: string;
	picture: string;
	birthday: string;
	phone: string;
	location: string;
	provider: string;
	token?: string;

	get name(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	constructor(user: User) {
		this.email = user.email;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.picture = user.picture;
		this.provider = user.provider;
	}
}
