export class UserPlan {
	id: number;
	name: string;
	countriesName: string;
	departureDate: string;
	returnDate: string;
	clickable: boolean;
	countries: Array<Country>;
	totalCost: number;
	numberOfNights: number;
}

export class Country {
	name: string;
	image: string;
	cities: Array<City>;
}

export class City {
	name: string;
	numberOfNights: number;
}
