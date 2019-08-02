import { City } from '../../../shared/models/city.model';
import { Carrier } from './carrier.model';

export class Flight {
	origin: City;
	destination: City;
	departure: string;
	flightOffers: Array<FlightOffer>;
	numberOfNights?: number;
}

export class FlightOffer {
	price: number;
	currency: string;
	originCityIata: string;
	destinationCityIata: string;
	isOneWay: boolean;
	totalDurationInWords: string;
	transitDurationInWords: string;
	totalDurationInMinutes: number;
	transitDurationInMinutes: number;
	segments: Array<Segment>;
	carrier: Carrier;
	flightIndex?: number;
	flightOfferIndex?: number;
	departure?: Segment;
	arrival?: Segment;
	numberOfStops?: number;
}

export class Segment {
	origin: string;
	destination: string;
	originDetails: string; // will usually be airport name
	destinationDetails: string; // will usually be airport name
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
