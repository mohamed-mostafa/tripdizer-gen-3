import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Destination } from '../../destinations/destination.model';
import { RequestService } from '../../request.service';
import { TravelingFrom } from '../../traveling-from/traveling-from.model';
import { Flight, FlightRequest } from './flight.model';

@Injectable({ providedIn: 'root' })
export class FlightsService {
	private endPoint = 'flights/flights/1.0.0/flights';
	private flights: Array<Flight> = [
		{
			origin: 'CAI',
			destination: 'AMS',
			departure: '2019-09-09T21:00:00.000Z',
			flightOffers: [
				{
					price: 7934.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'CAI',
							destination: 'AMS',
							totalDurationInWords: '12 h, 35 m',
							transitDurationInWords: '7 h, 5 m',
							totalDurationInMinutes: 755,
							transitDurationInMinutes: 425,
							segments: [
								{
									origin: 'CAI',
									destination: 'ATH',
									departure: '2019-09-10T03:10:00+02:00',
									return: '2019-09-10T06:10:00+03:00',
									durationInWords: '2 h',
									durationInMinutes: 120,
								},
								{
									origin: 'ATH',
									destination: 'AMS',
									departure: '2019-09-10T13:15:00+03:00',
									return: '2019-09-10T15:45:00+02:00',
									durationInWords: '3 h, 30 m',
									durationInMinutes: 210,
								},
							],
							carrier: {
								iataCode: 'A3',
								name: 'AEGEAN AIRLINES',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/A3.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/A3.png',
							},
						},
					],
				},
				{
					price: 10198.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'CAI',
							destination: 'AMS',
							totalDurationInWords: '11 h, 10 m',
							transitDurationInWords: '2 h, 10 m',
							totalDurationInMinutes: 670,
							transitDurationInMinutes: 130,
							segments: [
								{
									origin: 'CAI',
									destination: 'CMN',
									departure: '2019-09-10T06:30:00+02:00',
									return: '2019-09-10T11:05:00+01:00',
									durationInWords: '5 h, 35 m',
									durationInMinutes: 335,
								},
								{
									origin: 'CMN',
									destination: 'AMS',
									departure: '2019-09-10T13:15:00+01:00',
									return: '2019-09-10T17:40:00+02:00',
									durationInWords: '3 h, 25 m',
									durationInMinutes: 205,
								},
							],
							carrier: {
								iataCode: 'AT',
								name: 'ROYAL AIR MAROC',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/AT.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/AT.png',
							},
						},
					],
				},
				{
					price: 10974.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'CAI',
							destination: 'AMS',
							totalDurationInWords: '10 h, 20 m',
							transitDurationInWords: '1 h, 45 m',
							totalDurationInMinutes: 620,
							transitDurationInMinutes: 105,
							segments: [
								{
									origin: 'CAI',
									destination: 'SVO',
									departure: '2019-09-10T01:40:00+02:00',
									return: '2019-09-10T07:25:00+03:00',
									durationInWords: '4 h, 45 m',
									durationInMinutes: 285,
								},
								{
									origin: 'SVO',
									destination: 'AMS',
									departure: '2019-09-10T09:10:00+03:00',
									return: '2019-09-10T12:00:00+02:00',
									durationInWords: '3 h, 50 m',
									durationInMinutes: 230,
								},
							],
							carrier: {
								iataCode: 'SU',
								name: 'AEROFLOT',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/SU.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/SU.png',
							},
						},
					],
				},
			],
		},
		{
			origin: 'AMS',
			destination: 'PAR',
			departure: '2019-09-12T21:00:00.000Z',
			flightOffers: [
				{
					price: 4524.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CDG',
							totalDurationInWords: '1 h, 15 m',
							transitDurationInWords: '0 undefined',
							totalDurationInMinutes: 75,
							transitDurationInMinutes: 0,
							segments: [
								{
									origin: 'AMS',
									destination: 'CDG',
									departure: '2019-09-13T14:30:00+02:00',
									return: '2019-09-13T15:45:00+02:00',
									durationInWords: '1 h, 15 m',
									durationInMinutes: 75,
								},
							],
							carrier: {
								iataCode: 'AF',
								name: 'AIR FRANCE',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/AF.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/AF.png',
							},
						},
					],
				},
				{
					price: 4524.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CDG',
							totalDurationInWords: '1 h, 15 m',
							transitDurationInWords: '0 undefined',
							totalDurationInMinutes: 75,
							transitDurationInMinutes: 0,
							segments: [
								{
									origin: 'AMS',
									destination: 'CDG',
									departure: '2019-09-13T09:30:00+02:00',
									return: '2019-09-13T10:45:00+02:00',
									durationInWords: '1 h, 15 m',
									durationInMinutes: 75,
								},
							],
							carrier: {
								iataCode: 'KL',
								name: 'KLM ROYAL DUTCH AIRLINES',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/KL.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/KL.png',
							},
						},
					],
				},
			],
		},
		{
			origin: 'AMS',
			destination: 'CAI',
			departure: '2019-09-19T21:00:00.000Z',
			flightOffers: [
				{
					price: 6586.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CAI',
							totalDurationInWords: '8 h, 15 m',
							transitDurationInWords: '3 h, 5 m',
							totalDurationInMinutes: 495,
							transitDurationInMinutes: 185,
							segments: [
								{
									origin: 'AMS',
									destination: 'ATH',
									departure: '2019-09-20T16:35:00+02:00',
									return: '2019-09-20T20:50:00+03:00',
									durationInWords: '3 h, 15 m',
									durationInMinutes: 195,
								},
								{
									origin: 'ATH',
									destination: 'CAI',
									departure: '2019-09-20T23:55:00+03:00',
									return: '2019-09-21T00:50:00+02:00',
									durationInWords: '1 h, 55 m',
									durationInMinutes: 115,
								},
							],
							carrier: {
								iataCode: 'A3',
								name: 'AEGEAN AIRLINES',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/A3.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/A3.png',
							},
						},
					],
				},
				{
					price: 10626.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CAI',
							totalDurationInWords: '8 h, 10 m',
							transitDurationInWords: '2 h, 35 m',
							totalDurationInMinutes: 490,
							transitDurationInMinutes: 155,
							segments: [
								{
									origin: 'AMS',
									destination: 'FCO',
									departure: '2019-09-20T17:30:00+02:00',
									return: '2019-09-20T19:45:00+02:00',
									durationInWords: '2 h, 15 m',
									durationInMinutes: 135,
								},
								{
									origin: 'FCO',
									destination: 'CAI',
									departure: '2019-09-20T22:20:00+02:00',
									return: '2019-09-21T01:40:00+02:00',
									durationInWords: '3 h, 20 m',
									durationInMinutes: 200,
								},
							],
							carrier: {
								iataCode: 'AZ',
								name: 'ALITALIA S.P.A. IN A.S',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/AZ.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/AZ.png',
							},
						},
					],
				},
				{
					price: 11836.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CAI',
							totalDurationInWords: '11 h, 20 m',
							transitDurationInWords: '3 h',
							totalDurationInMinutes: 680,
							transitDurationInMinutes: 180,
							segments: [
								{
									origin: 'AMS',
									destination: 'SVO',
									departure: '2019-09-20T13:15:00+02:00',
									return: '2019-09-20T17:45:00+03:00',
									durationInWords: '3 h, 30 m',
									durationInMinutes: 210,
								},
								{
									origin: 'SVO',
									destination: 'CAI',
									departure: '2019-09-20T20:45:00+03:00',
									return: '2019-09-21T00:35:00+02:00',
									durationInWords: '4 h, 50 m',
									durationInMinutes: 290,
								},
							],
							carrier: {
								iataCode: 'SU',
								name: 'AEROFLOT',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/SU.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/SU.png',
							},
						},
					],
				},
			],
		},
	];

	constructor(private http: HttpClient, private requestService: RequestService) {}

	getFlights(): Observable<Array<Flight>> {
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			// departure: (this.requestService.getProperty('departureDate') as Moment).toISOString(),
			departure: '2019-07-10',
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
			// citiesSequence: [],
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
		};

		let params = new HttpParams();
		for (const key in flightRequest) {
			if (flightRequest.hasOwnProperty(key) && !params.has(key)) {
				params = params.set(key, flightRequest[key]);
			}
		}
		return this.http.get<string>(this.endPoint, { params }).pipe(
			map(response => {
				console.log(response);
				return this.flights;
			})
		);
	}
}
