import { City } from '../../../shared/models/city.model';
import { Carrier } from './carrier.model';

export class Flight {
	origin: City;
	destination: City;
	departure: string;
	flightOffers: Array<FlightOffer>;
}

export class FlightOffer {
	price: number;
	currency: string;
	totalDurationInWords: string;
	transitDurationInWords: string;
	totalDurationInMinutes: number;
	transitDurationInMinutes: number;
	segments: Array<Segment>;
	carrier: Carrier;
	flightIndex?: number;
}

export class Segment {
	origin: City;
	destination: City;
	departure: string;
	return: string;
	durationInWords: string;
	durationInMinutes: number;
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
