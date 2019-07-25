import { City } from '../../../shared/models/city.model';

export class CityAttractions {
	city: City;
	attractions: Array<Attraction>;
}

export class Attraction {
	name: String;
	descriptipn: String;
	category: String;
}

export class AttractionsRequest {
	cities: Array<{ cityIata: string, numberOfNights: number }>;
}