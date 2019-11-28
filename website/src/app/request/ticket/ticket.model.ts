import { RequestResponse } from '../request-dto.model';
import { Request } from '../request.model';

export class Ticket extends RequestResponse {
	packageUrl: string;
	packageDownloadUrl: string;
	preferenceNames: Array<string>;
	destinationName: string;

	static getTicketFromRequestResponse(request: Request, requestResponse: RequestResponse): Ticket {
		return {
			...requestResponse,
			packageUrl: requestResponse.packageUrl,
			packageDownloadUrl: requestResponse.packageDownloadUrl,
			travelingFrom: request.travelingFrom.iataCode,
			preferenceNames: request.preferenceNames,
			destinationName: request.selectedCities
				? request.selectedCities.length === 1
					? request.selectedCities[0].countryIsoCode
					: 'WORLD'
				: request.destination['iataCode'],
		};
	}
}
