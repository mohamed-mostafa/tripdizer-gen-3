export class Purpose {
	id: number;
	name: string;
	ar_name?: string;
	en_name?: string;
	image: string;
	adultsNumber?: number;
	kidsNumber?: number;
	infantsNumber?: number;
}

export enum LUTPurpose {
	Other = 1,
	Solo = 2,
	Family = 3,
	Group = 4,
	Honeymoon = 5,
	Business = 6,
}
