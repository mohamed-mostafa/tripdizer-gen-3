export class Place {
	id: number;
	iataCode: string;
	name: string;
	description: string;
	enName?: string;
	enDescription?: string;
	arName?: string;
	arDescription?: string;
	image: string;
	temperatureLo?: number;
	temperatureHi?: number;
}
