export class Flight {
	origin: string;
	destination: string;
	departure: string;
	flightOffers: Array<FlightOffer>;
}

export class FlightOffer {
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
	squareLogo: string;
	wideLogo: string;
}

export class FlightRequest {
	origin: string;
	departure: string;
	citiesSequence: Array<CitySequence>;
	numberOfAdults: number;
	numberOfChildren?: number;
	numberOfInfants?: number;
}

export class CitySequence {
	countryIso: string;
	cityIata: string;
	numberOfNights?: number;
}
