import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable } from 'rxjs';
import { RequestService } from '../request.service';
import { TravelingFrom } from '../traveling-from/traveling-from.model';
import { CityDTO } from './tab-cities/city-dto.model';
import { Flight, FlightOffer, FlightRequest } from './tab-flights/flight.model';

@Injectable({ providedIn: 'root' })
export class EstimatedCostService {
	private transportationEndPoint = 'package-options/1.0.0/transportationOffers';

	private selectedFlightOffers: Array<FlightOffer>;
	private selectedCities: Array<CityDTO>;

	constructor(private http: HttpClient, private requestService: RequestService) {}

	getSelectedCountriesISO(): Array<string> {
		return this.requestService.getProperty('countries');
	}

	setSelectedCities(selectedCities: Array<CityDTO>): void {
		this.selectedCities = selectedCities;
		this.requestService.setProperty('selectedCities', selectedCities);
	}

	getSelectedCities(): Array<CityDTO> {

		return this.selectedCities;
		// return [
		// 	{
		// 		countryIso: 'NED',
		// 		cityIata: 'AMS',
		// 		numberOfNights: 3,
		// 		countryDisplayName: 'Holland',
		// 		name: 'Amsterdam',
		// 		iataCode: 'AMS',
		// 		thumbnail: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/AMS.png'
		// 	},
		// 	{
		// 		countryIso: 'FRA',
		// 		cityIata: 'PAR',
		// 		numberOfNights: 7,
		// 		countryDisplayName: 'France',
		// 		name: 'Paris',
		// 		iataCode: 'PAR',
		// 		thumbnail: 'https://storage.cloud.google.com/tripdizer-dev.appspot.com/cities/PAR.png'
		// 	},
		// ];
	}

	getFlights(): Observable<Array<Flight>> {
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			departure: (this.requestService.getProperty('departureDate') as Moment).format('YYYY-MM-DD'),
			citiesSequence: this.getSelectedCities(),
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
		};

		return this.http.post<Array<Flight>>(`${this.transportationEndPoint}/search`, flightRequest);
	}

	setSelectedFlightOffers(flightOffers: Array<FlightOffer>): void {
		this.selectedFlightOffers = flightOffers;

		this.requestService.setProperty('flightOffers', flightOffers);
	}
}
