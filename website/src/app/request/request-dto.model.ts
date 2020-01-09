import { Moment } from 'moment';
import { LUTPreference } from '../shared/models/preference.model';
import { CommonFunctions } from '../shared/utils';
import { Hotel } from './estimated-cost/tab-accommodation/accommodation.model';
import { CityDTO } from './estimated-cost/tab-cities/city-dto.model';
import { FlightOffer } from './estimated-cost/tab-flights/flight-offer.model';
import { Request } from './request.model';
import { IRequester } from './requester.model';
import { Attraction } from './summary/attraction.model';
import { Traveller } from './summary/booking-steps/travellers-info-step/traveller-info/traveller.model';
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
	otherPreferenceName?: string;
	destination: number;
	flightOffers: Array<FlightOffer>;
	selectedCities: Array<CityDTO>;
	selectedHotels: Array<Hotel>;
	selectedAttractions: Array<Attraction>;
	estimatedCost: number;
	visaAssistanceNeeded: boolean;
	tourGuideNeeded: boolean;
	promoCode: string;
	specialRequests: string;
	traveler: IRequester;
	referralType: number;
	travelHistory: TravelHistory;
	pnrInfoList: Array<Traveller>;
	requiresPayment: boolean;

	static getRequestRequestFromRequest(request: Request, requiresPayment: boolean): RequestRequest {
		const requestRequest: RequestRequest = {
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
			otherPreferenceName: request.getPreferenceName(LUTPreference.Other),
			destination: request.destination ? request.destination.id : null,
			flightOffers: request.flightOffers,
			selectedHotels: [], // to be refactored
			selectedCities: request.cities.filter(c => c.selected),
			selectedAttractions: request.selectedAttractions,
			estimatedCost: request.estimatedCost,
			visaAssistanceNeeded: request.visaAssistanceNeeded,
			tourGuideNeeded: request.tourGuideNeeded,
			promoCode: request.promoCode,
			specialRequests: request.specialRequests,
			traveler: {
				...request.traveler,
				mobile: CommonFunctions.parseArabicNumber(request.traveler.mobile || request.travellers[0].phone),
			},
			referralType: request.referralType,
			travelHistory: request.travelHistory,
			pnrInfoList: request.travellers,
			requiresPayment,
		};
		if (requiresPayment) {
			requestRequest.traveler.name = `${request.travellers[0].firstName} ${request.travellers[0].lastName}`;
			requestRequest.traveler.email = request.travellers[0].email;
		}
		return requestRequest;
	}
}

export class RequestResponse extends RequestRequest {
	id: number;
	packageUrl?: string;
	packageDownloadUrl?: string;
	paymentKey?: string;
}
