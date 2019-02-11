import { Moment } from 'moment';

export interface IRequester {
	name: string;
	mobile: string;
	email: string;
	birthday: Moment;
}
