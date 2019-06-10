export class Preference {
	id: number;
	name: string;
	ar_name?: string;
	en_name?: string;
	image: string;
}

export enum LUTPreference {
	Other = 0,
	Activities = 1,
	History = 2,
	Nightlife = 3,
	Beaches = 4,
	Nature = 5,
	Shopping = 6,
}
