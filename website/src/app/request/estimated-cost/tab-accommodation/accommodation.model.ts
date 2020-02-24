import { CityDTO } from './../tab-cities/city-dto.model';

export class Accommodation {
	city: CityDTO;
	hotels: Array<Hotel>;
}

export class Hotel {
	id: number;
	name: string;
	displayName: string;
	description: string;
	city: string;
	thumbnail: string;
	address: string;
	stars: number;
	checkin: string;
	checkout: string;
	numberOfNights: number;
	rate: number;
	price: number;
	currency: string;
	selected?: boolean;
}

export class AccommodationRequest {
	arrival: string;
	budgetCategory: string;
	cities: Array<{ cityName: string, numberOfNights: number, countryName: string }>;
	numberOfAdults: number;
	numberOfChildren: number;
	numberOfInfants: number;
	desiredCostPerPerson: number;
}
