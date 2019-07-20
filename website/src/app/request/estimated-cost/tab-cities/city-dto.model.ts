export class CityDTO {
	/* TODO: START To be removed */
	country?: string;
	town?: string;
	description?: string;
	image?: string;
	activities?: Array<string>;
	icons?: { link: string; alt: string }[];
	/* TODO: END To be removed */

	countryIso: string;
	cityIata: string;
	numberOfNights?: number;
	countryDisplayName: string;
	thumbnail: string;
	iataCode: string;
	name: string;
	interests: Array<String>;
	select?: boolean;
}
