import { Moment } from 'moment';
import { LUTBudgetCategory } from '../budget/budget-category.model';
import { Request } from '../request.model';

export class EstimatedCostRequest {
	departureDate: Moment;
	returnDate: Moment;
	adultsNumber: number;
	kidsNumber: number;
	infantsNumber: number;
	budgetCategory: number;
	budget: number;
	destination: number;

	static getEstimatedCostRequestFromRequest(request: Request): EstimatedCostRequest {
		return {
			departureDate: request.departureDate,
			returnDate: request.returnDate,
			adultsNumber: request.adultsNumber,
			kidsNumber: request.kidsNumber,
			infantsNumber: request.infantsNumber,
			budgetCategory: request.budgetCategory,
			budget: request.budgetCategory === LUTBudgetCategory.OwnBudget ? request.budget : 0,
			destination: request.destination.id,
		};
	}
}

export class EstimatedCostResponse {
	flightsBudget: number;
	dailySpending: number;
	accommodationBudget: number;
	ferriesBudget: number;
	numberOfTravelers: number;
	totalBudget: number;
}
