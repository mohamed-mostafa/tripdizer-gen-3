import { Place } from './place.model';

export class Country extends Place {
	ISOCode: string;
	visaTypeName: string;
	minimumTravelBudget: number;
	minimumDailyBudget: number;
	maximumDailyBudget: number;
}
