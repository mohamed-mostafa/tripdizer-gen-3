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
  destinationName?: string;
  estimatedCost: number;
  visaAssistanceNeeded: boolean;
  tourGuideNeeded: boolean;
  specialRequests: string;
  traveler: IRequester;
  referralType: number;

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
      preferences: request.preferences,
      destination: request.destination,
      destinationName: request.destination === -1 ? request.destinationName : null,
      estimatedCost: request.estimatedCost,
      visaAssistanceNeeded: request.visaAssistanceNeeded,
      tourGuideNeeded: request.tourGuideNeeded,
      specialRequests: request.specialRequests,
      traveler: request.traveler,
      referralType: request.referralType
    };
  }
}

export class RequestResponse extends RequestRequest {
  id: number;
}
