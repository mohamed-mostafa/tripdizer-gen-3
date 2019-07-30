import { RequestResponse } from '../request-dto.model';
import { Request } from '../request.model';

export class Ticket extends RequestResponse {
	preferenceNames: Array<string>;
	destinationName: string;

	static getTicketFromRequestResponse(request: Request, requestResponse: RequestResponse): Ticket {
		return {
			...requestResponse,
			travelingFrom: request.travelingFrom.iataCode,
			preferenceNames: request.preferenceNames,
			destinationName: request.destination && request.destination.ISOCode ? request.destination.ISOCode : request.selectedCities[0].iataCode,
		};
	}
}
