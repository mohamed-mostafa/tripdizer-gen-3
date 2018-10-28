import { Moment } from 'moment';
import { Request } from '../request.model';

export class RecommendedDestinationsRequest {
    departureDate: Moment;
    returnDate: Moment;
    budget: number;
    budgetCategory: number;
    purpose: number;
    preferences: Array<number>;

    static getRecommendedDestinationsRequestFromRequest(request: Request): RecommendedDestinationsRequest {
        return {
            departureDate: request.departureDate,
            returnDate: request.returnDate,
            budget: request.budget,
            budgetCategory: request.budgetCategory,
            purpose: request.purpose,
            preferences: request.preferences,
        };
    }
}

export class RecommendedDestinationsResponse {
    id: number;
    name: string;
    description: string;
    enName?: string;
    enDescription?: string;
    arName?: string;
    arDescription?: string;
    image: string;
    temperatureLo?: number;
    temperatureHi?: number;
    estimatedCost: number;
    recommendationRanks: {
        budget: number,
        purpose: number,
        season: number,
        interest: number,
        needsVisa: number
    };
    rank: number;
}
