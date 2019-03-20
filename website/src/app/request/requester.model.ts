import { Moment } from 'moment';
import { Gender } from './gender.enum';

export interface IRequester {
	name: string;
	mobile: string;
	email: string;
	gender: Gender;
	birthday: Moment;
	profession: number;
}
