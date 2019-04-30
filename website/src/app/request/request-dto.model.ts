import { Moment } from 'moment';
import { CommonFunctions } from '../shared/utils';
import { Request } from './request.model';
import { IRequester } from './requester.model';
import { TravelHistory } from './travel-history.enum';

export class RequestRequest {
	travelingFrom: string;
	departureDate: Moment;
	returnDate: Moment;
	isFlexibleDates: boolean;
	adultsNumber: number;
	kidsNumber: number;
	infantsNumber: number;
	budget: number;
	budgetCategory: number;
	purpose: number;
	otherPurposeName?: string;
	preferences: Array<number>;
	destination: number;
	estimatedCost: number;
	visaAssistanceNeeded: boolean;
	tourGuideNeeded: boolean;
	promoCode: string;
	specialRequests: string;
	traveler: IRequester;
	referralType: number;
	travelHistory: TravelHistory;

	static getRequestRequestFromRequest(request: Request): RequestRequest {
		return {
			travelingFrom: request.travelingFrom.name,
			departureDate: request.departureDate,
			returnDate: request.returnDate,
			isFlexibleDates: request.isFlexibleDates,
			adultsNumber: request.adultsNumber,
			kidsNumber: request.kidsNumber,
			infantsNumber: request.infantsNumber,
			budget: request.budget,
			budgetCategory: request.budgetCategory,
			purpose: request.purpose,
			otherPurposeName: request.purposeName,
			preferences: request.preferences,
			destination: request.destination.id,
			estimatedCost: request.estimatedCost,
			visaAssistanceNeeded: request.visaAssistanceNeeded,
			tourGuideNeeded: request.tourGuideNeeded,
			promoCode: request.promoCode,
			specialRequests: request.specialRequests,
			traveler: {
				...request.traveler,
				mobile: CommonFunctions.parseArabicNumber(request.traveler.mobile),
			},
			referralType: request.referralType,
			travelHistory: request.travelHistory,
		};
	}
}

export class RequestResponse extends RequestRequest {
	id: number;
	packageUrl: string;
	packageDownloadUrl: string;
}
