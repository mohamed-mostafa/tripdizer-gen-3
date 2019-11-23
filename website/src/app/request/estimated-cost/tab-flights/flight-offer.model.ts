import { City } from '../../../shared/models/city.model';
import { Carrier } from './carrier.model';

export class FlightOffer {
	price: number;
	origin: City;
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
	numberOfNights?: number;
    flightLegs: Array<FlightLeg>;
    selected?: boolean;
    fareSourceCode: string;
}

export class FlightLeg {
	origin: City;
	destination: City;
	flightDay: string;
	segments: Array<Segment>;
	carrier: { iataCode: string, name: string };
	totalDurationInMinutes: number;
	totalDurationInWords: string;
	transitDurationInMinutes: number;
	transitDurationInWords: string;
	numberOfNights?: number;
}

export class Segment {
	origin: string;
	destination: string;
	originDetails: string; // will usually be airport name
	destinationDetails: string; // will usually be airport name
	departure: string;
	arrival: string;
	return: string;
	totalDurationInWords: string;
	totalDurationInMinutes: number;
	carrier: { iataCode: string, name: string };
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
