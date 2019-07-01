export class Flight {
	price: number;
	currency: string;
	flightLegs: Array<FlightLeg>;
}

export class FlightLeg {
	origin: string;
	destination: string;
	totalDurationInWords: string;
	transitDurationInWords: string;
	totalDurationInMinutes: number;
	transitDurationInMinutes: number;
	segments: Array<Segment>;
	carrier: Carrier;
}

export class Segment {
	origin: string;
	destination: string;
	departure: string;
	return: string;
	durationInWords: string;
	durationInMinutes: number;
}

export class Carrier {
	iataCode: string;
	name: string;
}

export class FlightRequest {
	origin: string;
	destination: string;
	departure: string;
	return: string;
	numberOfAdults: number;
	numberOfChildren?: number;
	numberOfInfants?: number;
}
