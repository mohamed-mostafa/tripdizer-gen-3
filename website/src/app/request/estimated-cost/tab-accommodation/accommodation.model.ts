import { Moment } from 'moment';
import { CityDTO } from './../tab-cities/city-dto.model';

export class Accommodation {
	city: CityDTO;
	hotels: Array<Hotel>;
}

export class Hotel {
	id: number;
	name: string;
	displaName: string;
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
	select?: boolean;
}

export class AccommodationRequest {
	arrival: string;
	budgetCategory: string;
	cities: Array<{ cityIata: string, numberOfNights: number }>;
	numberOfAdults: number;
	numberOfChildren: number;
	numberOfInfants: number;
}
