import { City } from '../../../shared/models/city.model';

export class CityAttractions {
	city: City;
	attractions: Array<Attraction>;
}

export class Attraction {
	name: string;
	descriptipn: string;
	category: string;
}

export class AttractionsRequest {
	cities: Array<{ cityIata: string; numberOfNights: number }>;
}
