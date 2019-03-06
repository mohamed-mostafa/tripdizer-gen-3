export class Destination {
	id: number;
	name: string;
	description: string;
	iataCode: string;
	enName?: string;
	enDescription?: string;
	arName?: string;
	arDescription?: string;
	image: string;
	visaTypeName: string;
	temperatureLo?: number;
	temperatureHi?: number;
}
