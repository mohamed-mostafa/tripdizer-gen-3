import { Moment } from 'moment';
import { Request } from '../request.model';
import { Destination } from '../destinations/destination.model';

export class RecommendedDestinationsRequest {
	departureDate: Moment;
	returnDate: Moment;
	adultsNumber: number;
	kidsNumber: number;
	infantsNumber: number;
	budget: number;
	budgetCategory: number;
	purpose: number;
	preferences: Array<number>;

	static getRecommendedDestinationsRequestFromRequest(request: Request): RecommendedDestinationsRequest {
		return {
			departureDate: request.departureDate,
			returnDate: request.returnDate,
			adultsNumber: request.adultsNumber,
			kidsNumber: request.kidsNumber,
			infantsNumber: request.infantsNumber,
			budget: request.budget,
			budgetCategory: request.budgetCategory,
			purpose: request.purpose,
			preferences: request.preferences,
		};
	}
}

export class RecommendedDestinationsResponse extends Destination {
	estimatedCost: number;
	recommendationRanks: {
		budget: number;
		purpose: number;
		season: number;
		interest: number;
		visa: number;
	};
	rank: number;
}
