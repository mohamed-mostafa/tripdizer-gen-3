import { Moment } from 'moment';
import { Request } from './request.model';
import { IRequester } from './requester.model';

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
  preferences: Array<number>;
  destination: number;
  estimatedCost: number;
  visaAssistanceNeeded: boolean;
  tourGuideNeeded: boolean;
  specialRequests: string;
  traveler: IRequester;

  static getRequestRequestFromRequest(request: Request): RequestRequest {
    return {
      travelingFrom: request.travelingFrom,
      departureDate: request.departureDate,
      returnDate: request.returnDate,
      isFlexibleDates: request.isFlexibleDates,
      adultsNumber: request.adultsNumber,
      kidsNumber: request.kidsNumber,
      infantsNumber: request.infantsNumber,
      budget: request.budget,
      budgetCategory: request.budgetCategory,
      purpose: request.purpose,
      preferences: request.preferences,
      destination: request.destination,
      estimatedCost: request.estimatedCost,
      visaAssistanceNeeded: request.visaAssistanceNeeded,
      tourGuideNeeded: request.tourGuideNeeded,
      specialRequests: request.specialRequests,
      traveler: request.traveler
    };
  }
}

export class RequestResponse extends RequestRequest {
  id: number;
}
