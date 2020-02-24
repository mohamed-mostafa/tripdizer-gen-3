export class CityDTO {
	/* TODO: START To be removed */
	country?: string;
	town?: string;
	description?: string;
	image?: string;
	activities?: Array<string>;
	icons?: { link: string; alt: string }[];
	/* TODO: END To be removed */

	countryIsoCode: string;
	cityIata: string;
	displayName: string;
	numberOfNights?: number;
	countryDisplayName: string;
	thumbnail: string;
	iataCode: string;
	name: string;
	interests: Array<string>;
	selected?: boolean;
	coordinates: string;
}
