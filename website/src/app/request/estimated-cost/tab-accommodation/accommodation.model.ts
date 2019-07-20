import { CityDTO } from './../tab-cities/city-dto.model';

export class Accommodation {
	city: CityDTO;
	hotels: Array<Hotel>;
}

export class Hotel {
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
}