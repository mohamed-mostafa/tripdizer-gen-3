import { Moment } from 'moment';

export interface IRequester {
	name: string;
	mobile: string;
	email: string;
	gender: Gender;
	birthday: Moment;
}

export enum Gender {
	male = 1,
	female = 2,
}
