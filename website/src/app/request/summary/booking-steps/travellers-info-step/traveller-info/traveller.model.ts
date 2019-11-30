import * as moment from 'moment';

export class Traveller {
	title: string;
	firstName: string;
	lastName: string;
	dateOfBirth: moment.Moment;
	ageGroup: string;
	gender: string;
	email: string;
	phone: string;
	nationality: string;
	passportNumber: string;
	passportExpiry: moment.Moment;
	passportIssueCountry: string;
}
