export class UserBooking {
	id: number;
	name: string;
	countriesName: string;
	departureDate: string;
	returnDate: string;
	clickable: boolean;
	countries: Array<UserBookingCountry>;
	totalCost: number;
	numberOfNights: number;
}

class UserBookingCountry {
	name: string;
	image: string;
	cities: Array<UserBookingCity>;
}

class UserBookingCity {
	name: string;
	numberOfNights: number;
}
