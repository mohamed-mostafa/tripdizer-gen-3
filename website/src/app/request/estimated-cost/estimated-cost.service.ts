import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable } from 'rxjs';
import { RequestService } from '../request.service';
import { TravelingFrom } from '../traveling-from/traveling-from.model';
import { Flight, FlightRequest } from './tab-flights/flight.model';

@Injectable({ providedIn: 'root' })
export class EstimatedCostService {
	private transportationEndPoint = 'package-options/1.0.0/transportationOffers';

	constructor(private http: HttpClient, private requestService: RequestService) {}

	getFlights(): Observable<Array<Flight>> {
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			departure: (this.requestService.getProperty('departureDate') as Moment).format('YYYY-MM-DD'),
			citiesSequence: [
				{
					countryIso: 'NED',
					cityIata: 'AMS',
					numberOfNights: 3,
				},
				{
					countryIso: 'FRA',
					cityIata: 'PAR',
					numberOfNights: 7,
				},
			],
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
		};

		return this.http.post<Array<Flight>>(`${this.transportationEndPoint}/search`, flightRequest);
	}
}
