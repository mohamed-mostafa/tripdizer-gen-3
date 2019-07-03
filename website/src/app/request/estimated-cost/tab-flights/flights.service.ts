import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Destination } from '../../destinations/destination.model';
import { RequestService } from '../../request.service';
import { TravelingFrom } from '../../traveling-from/traveling-from.model';
import { Flight, FlightRequest } from './flight.model';

@Injectable({ providedIn: 'root' })
export class FlightsService {
	private endPoint = 'package-options/1.0.0/transportationOfferOptions';
	private flights: Array<Flight> = [
		{
			origin: 'CAI',
			destination: 'AMS',
			departure: '2019-07-09T21:00:00.000Z',
			flightOffers: [
				{
					price: 4423.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'CAI',
							destination: 'AMS',
							totalDurationInWords: '6 h, 20 m',
							transitDurationInWords: '45 m',
							totalDurationInMinutes: 380,
							transitDurationInMinutes: 45,
							segments: [
								{
									origin: 'CAI',
									destination: 'BEG',
									departure: '2019-07-10T02:50:00+02:00',
									return: '2019-07-10T05:55:00+02:00',
									durationInWords: '3 h, 5 m',
									durationInMinutes: 185,
								},
								{
									origin: 'BEG',
									destination: 'AMS',
									departure: '2019-07-10T06:40:00+02:00',
									return: '2019-07-10T09:10:00+02:00',
									durationInWords: '2 h, 30 m',
									durationInMinutes: 150,
								},
							],
							carrier: {
								iataCode: 'JU',
								name: 'AIR SERBIA',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/JU.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/JU.png',
							},
						},
					],
				},
				{
					price: 4599.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'CAI',
							destination: 'AMS',
							totalDurationInWords: '7 h, 40 m',
							transitDurationInWords: '1 h, 50 m',
							totalDurationInMinutes: 460,
							transitDurationInMinutes: 110,
							segments: [
								{
									origin: 'CAI',
									destination: 'OTP',
									departure: '2019-07-10T03:00:00+02:00',
									return: '2019-07-10T06:50:00+03:00',
									durationInWords: '2 h, 50 m',
									durationInMinutes: 170,
								},
								{
									origin: 'OTP',
									destination: 'AMS',
									departure: '2019-07-10T08:40:00+03:00',
									return: '2019-07-10T10:40:00+02:00',
									durationInWords: '3 h',
									durationInMinutes: 180,
								},
							],
							carrier: {
								iataCode: 'RO',
								name: 'TAROM',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/RO.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/RO.png',
							},
						},
					],
				},
				{
					price: 5355.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'CAI',
							destination: 'AMS',
							totalDurationInWords: '8 h',
							transitDurationInWords: '1 h, 45 m',
							totalDurationInMinutes: 480,
							transitDurationInMinutes: 105,
							segments: [
								{
									origin: 'CAI',
									destination: 'AMM',
									departure: '2019-07-10T06:45:00+02:00',
									return: '2019-07-10T09:00:00+03:00',
									durationInWords: '1 h, 15 m',
									durationInMinutes: 75,
								},
								{
									origin: 'AMM',
									destination: 'AMS',
									departure: '2019-07-10T10:45:00+03:00',
									return: '2019-07-10T14:45:00+02:00',
									durationInWords: '5 h',
									durationInMinutes: 300,
								},
							],
							carrier: {
								iataCode: 'RJ',
								name: 'ROYAL JORDANIAN',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/RJ.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/RJ.png',
							},
						},
					],
				},
			],
		},
		{
			origin: 'AMS',
			destination: 'PAR',
			departure: '2019-07-12T21:00:00.000Z',
			flightOffers: [
				{
					price: 4262.0,
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
									departure: '2019-07-13T14:30:00+02:00',
									return: '2019-07-13T15:45:00+02:00',
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
				{
					price: 4489.0,
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
									departure: '2019-07-13T14:30:00+02:00',
									return: '2019-07-13T15:45:00+02:00',
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
			],
		},
		{
			origin: 'AMS',
			destination: 'CAI',
			departure: '2019-07-19T21:00:00.000Z',
			flightOffers: [
				{
					price: 8491.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CAI',
							totalDurationInWords: '6 h, 15 m',
							transitDurationInWords: '45 m',
							totalDurationInMinutes: 375,
							transitDurationInMinutes: 45,
							segments: [
								{
									origin: 'AMS',
									destination: 'OTP',
									departure: '2019-07-20T20:00:00+02:00',
									return: '2019-07-20T23:45:00+03:00',
									durationInWords: '2 h, 45 m',
									durationInMinutes: 165,
								},
								{
									origin: 'OTP',
									destination: 'CAI',
									departure: '2019-07-21T00:30:00+03:00',
									return: '2019-07-21T02:15:00+02:00',
									durationInWords: '2 h, 45 m',
									durationInMinutes: 165,
								},
							],
							carrier: {
								iataCode: 'RO',
								name: 'TAROM',
								squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/RO.png',
								wideLogo: 'https://www.skyscanner.net/images/airlines/small/RO.png',
							},
						},
					],
				},
				{
					price: 10864.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CAI',
							totalDurationInWords: '13 h, 20 m',
							transitDurationInWords: '7 h, 45 m',
							totalDurationInMinutes: 800,
							transitDurationInMinutes: 465,
							segments: [
								{
									origin: 'AMS',
									destination: 'FCO',
									departure: '2019-07-20T12:20:00+02:00',
									return: '2019-07-20T14:35:00+02:00',
									durationInWords: '2 h, 15 m',
									durationInMinutes: 135,
								},
								{
									origin: 'FCO',
									destination: 'CAI',
									departure: '2019-07-20T22:20:00+02:00',
									return: '2019-07-21T01:40:00+02:00',
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
					price: 11185.0,
					currency: 'EGP',
					flightLegs: [
						{
							origin: 'AMS',
							destination: 'CAI',
							totalDurationInWords: '12 h, 50 m',
							transitDurationInWords: '7 h, 40 m',
							totalDurationInMinutes: 770,
							transitDurationInMinutes: 460,
							segments: [
								{
									origin: 'AMS',
									destination: 'ATH',
									departure: '2019-07-20T12:00:00+02:00',
									return: '2019-07-20T16:15:00+03:00',
									durationInWords: '3 h, 15 m',
									durationInMinutes: 195,
								},
								{
									origin: 'ATH',
									destination: 'CAI',
									departure: '2019-07-20T23:55:00+03:00',
									return: '2019-07-21T00:50:00+02:00',
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
			],
		},
	];

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

		// return this.http.post<Array<Flight>>(`${this.endPoint}/search`, flightRequest);
		return of(this.flights).pipe(delay(2000));
	}
}
