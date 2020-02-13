export class UserPlan {
	id: number;
	name: string;
	countriesName: string;
	departureDate: string;
	returnDate: string;
	clickable: boolean;
	countries: Array<UserPlanCountry>;
	totalCost: number;
	numberOfNights: number;
}

class UserPlanCountry {
	name: string;
	image: string;
	cities: Array<UserPlanCity>;
}

class UserPlanCity {
	name: string;
	numberOfNights: number;
}
