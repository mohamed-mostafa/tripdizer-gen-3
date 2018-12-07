import { Moment } from 'moment';
import { Request } from '../request.model';

export class EstimatedCostRequest {
  departureDate: Moment;
  returnDate: Moment;
  adultsNumber: number;
  kidsNumber: number;
  infantsNumber: number;
  budgetCategory: number;
  destination: number;

  static getEstimatedCostRequestFromRequest(request: Request): EstimatedCostRequest {
    return {
      departureDate: request.departureDate,
      returnDate: request.returnDate,
      adultsNumber: request.adultsNumber,
      kidsNumber: request.kidsNumber,
      infantsNumber: request.infantsNumber,
      budgetCategory: request.budgetCategory,
      destination: request.destination.id
    };
  }
}

export class EstimatedCostResponse {
  flightsBudget: number;
  dailySpending: number;
  accommodationBudget: number;
  ferriesBudget: number;
  totalBudget: number;
}
