import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { RequestService } from '../../request.service';
import { TravelingFrom } from '../../traveling-from/traveling-from.model';
import { Flight, FlightRequest } from './flight.model';

@Injectable({ providedIn: 'root' })
export class FlightsService {
	private endPoint = 'package-options/1.0.0/transportationOfferOptions';
	private flights: Array<Flight> = [
		{
			origin: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
			destination: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
			departure: '2019-07-08T21:00:00.000Z',
			flightOffers: [
				{
					price: 3959.0,
					currency: 'EGP',
					totalDurationInWords: '6 h, 25 m',
					transitDurationInWords: '55 m',
					totalDurationInMinutes: 385,
					transitDurationInMinutes: 55,
					segments: [
						{
							origin: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
							destination: { id: null, iataCode: 'ATH', name: 'Athens', description: null, image: null },
							departure: '2019-07-09T09:20:00+02:00',
							return: '2019-07-09T12:20:00+03:00',
							durationInWords: '2 h',
							durationInMinutes: 120,
						},
						{
							origin: { id: null, iataCode: 'ATH', name: 'Athens', description: null, image: null },
							destination: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							departure: '2019-07-09T13:15:00+03:00',
							return: '2019-07-09T15:45:00+02:00',
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
				{
					price: 5462.0,
					currency: 'EGP',
					totalDurationInWords: '10 h, 20 m',
					transitDurationInWords: '1 h, 45 m',
					totalDurationInMinutes: 620,
					transitDurationInMinutes: 105,
					segments: [
						{
							origin: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
							destination: { id: null, iataCode: 'SVO', name: 'Sheremetyevo', description: null, image: null },
							departure: '2019-07-09T01:40:00+02:00',
							return: '2019-07-09T07:25:00+03:00',
							durationInWords: '4 h, 45 m',
							durationInMinutes: 285,
						},
						{
							origin: { id: null, iataCode: 'SVO', name: 'Sheremetyevo', description: null, image: null },
							destination: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							departure: '2019-07-09T09:10:00+03:00',
							return: '2019-07-09T12:00:00+02:00',
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
				{
					price: 5664.0,
					currency: 'EGP',
					totalDurationInWords: '10 h, 15 m',
					transitDurationInWords: '4 h, 10 m',
					totalDurationInMinutes: 615,
					transitDurationInMinutes: 250,
					segments: [
						{
							origin: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
							destination: { id: null, iataCode: 'IST', name: 'Istanbul', description: null, image: null },
							departure: '2019-07-09T02:50:00+02:00',
							return: '2019-07-09T06:25:00+03:00',
							durationInWords: '2 h, 35 m',
							durationInMinutes: 155,
						},
						{
							origin: { id: null, iataCode: 'IST', name: 'Istanbul', description: null, image: null },
							destination: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							departure: '2019-07-09T10:35:00+03:00',
							return: '2019-07-09T13:05:00+02:00',
							durationInWords: '3 h, 30 m',
							durationInMinutes: 210,
						},
					],
					carrier: {
						iataCode: 'TK',
						name: 'TURKISH AIRLINES',
						squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/TK.png',
						wideLogo: 'https://www.skyscanner.net/images/airlines/small/TK.png',
					},
				},
			],
		},
		{
			origin: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
			destination: { id: null, iataCode: 'PAR', name: 'Paris', description: null, image: null },
			departure: '2019-07-11T21:00:00.000Z',
			flightOffers: [
				{
					price: 5077.0,
					currency: 'EGP',
					totalDurationInWords: '1 h, 15 m',
					transitDurationInWords: '0 undefined',
					totalDurationInMinutes: 75,
					transitDurationInMinutes: 0,
					segments: [
						{
							origin: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							destination: { id: null, iataCode: 'CDG', name: 'Charles', description: null, image: null },
							departure: '2019-07-12T17:50:00+02:00',
							return: '2019-07-12T19:05:00+02:00',
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
				{
					price: 5246.0,
					currency: 'EGP',
					totalDurationInWords: '1 h, 15 m',
					transitDurationInWords: '0 undefined',
					totalDurationInMinutes: 75,
					transitDurationInMinutes: 0,
					segments: [
						{
							origin: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							destination: { id: null, iataCode: 'CDG', name: 'Charles', description: null, image: null },
							departure: '2019-07-12T17:50:00+02:00',
							return: '2019-07-12T19:05:00+02:00',
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
			origin: { id: null, iataCode: 'PAR', name: 'Paris', description: null, image: null },
			destination: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
			departure: '2019-07-11T21:00:00.000Z',
			flightOffers: [
				{
					price: 5077.0,
					currency: 'EGP',
					totalDurationInWords: '1 h, 15 m',
					transitDurationInWords: '0 undefined',
					totalDurationInMinutes: 75,
					transitDurationInMinutes: 0,
					segments: [
						{
							origin: { id: null, iataCode: 'CDG', name: 'Charles', description: null, image: null },
							destination: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							departure: '2019-07-12T17:50:00+02:00',
							return: '2019-07-12T19:05:00+02:00',
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
				{
					price: 5246.0,
					currency: 'EGP',
					totalDurationInWords: '1 h, 15 m',
					transitDurationInWords: '0 undefined',
					totalDurationInMinutes: 75,
					transitDurationInMinutes: 0,
					segments: [
						{
							origin: { id: null, iataCode: 'CDG', name: 'Charles', description: null, image: null },
							destination: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							departure: '2019-07-12T17:50:00+02:00',
							return: '2019-07-12T19:05:00+02:00',
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
			origin: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
			destination: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
			departure: '2019-07-18T21:00:00.000Z',
			flightOffers: [
				{
					price: 4890.0,
					currency: 'EGP',
					totalDurationInWords: '8 h, 15 m',
					transitDurationInWords: '3 h, 5 m',
					totalDurationInMinutes: 495,
					transitDurationInMinutes: 185,
					segments: [
						{
							origin: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							destination: { id: null, iataCode: 'ATH', name: 'Athens', description: null, image: null },
							departure: '2019-07-19T16:35:00+02:00',
							return: '2019-07-19T20:50:00+03:00',
							durationInWords: '3 h, 15 m',
							durationInMinutes: 195,
						},
						{
							origin: { id: null, iataCode: 'ATH', name: 'Athens', description: null, image: null },
							destination: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
							departure: '2019-07-19T23:55:00+03:00',
							return: '2019-07-20T00:50:00+02:00',
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
				{
					price: 12128.0,
					currency: 'EGP',
					totalDurationInWords: '12 h, 25 m',
					transitDurationInWords: '3 h, 50 m',
					totalDurationInMinutes: 745,
					transitDurationInMinutes: 230,
					segments: [
						{
							origin: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							destination: { id: null, iataCode: 'CMN', name: 'CMN name', description: null, image: null },
							departure: '2019-07-19T18:40:00+02:00',
							return: '2019-07-19T21:20:00+01:00',
							durationInWords: '3 h, 40 m',
							durationInMinutes: 220,
						},
						{
							origin: { id: null, iataCode: 'CMN', name: 'CMN name', description: null, image: null },
							destination: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
							departure: '2019-07-20T01:10:00+01:00',
							return: '2019-07-20T07:05:00+02:00',
							durationInWords: '4 h, 55 m',
							durationInMinutes: 295,
						},
					],
					carrier: {
						iataCode: 'AT',
						name: 'ROYAL AIR MAROC',
						squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/AT.png',
						wideLogo: 'https://www.skyscanner.net/images/airlines/small/AT.png',
					},
				},
				{
					price: 12220.0,
					currency: 'EGP',
					totalDurationInWords: '7 h, 40 m',
					transitDurationInWords: '2 h, 15 m',
					totalDurationInMinutes: 460,
					transitDurationInMinutes: 135,
					segments: [
						{
							origin: { id: null, iataCode: 'AMS', name: 'Amsterdam', description: null, image: null },
							destination: { id: null, iataCode: 'VIE', name: 'VIE name', description: null, image: null },
							departure: '2019-07-19T07:00:00+02:00',
							return: '2019-07-19T08:55:00+02:00',
							durationInWords: '1 h, 55 m',
							durationInMinutes: 115,
						},
						{
							origin: { id: null, iataCode: 'VIE', name: 'VIE name', description: null, image: null },
							destination: { id: null, iataCode: 'CAI', name: 'Cairo', description: null, image: null },
							departure: '2019-07-19T11:10:00+02:00',
							return: '2019-07-19T14:40:00+02:00',
							durationInWords: '3 h, 30 m',
							durationInMinutes: 210,
						},
					],
					carrier: {
						iataCode: 'OS',
						name: 'AUSTRIAN AIRLINES',
						squareLogo: 'https://www.gstatic.com/flights/airline_logos/70px/OS.png',
						wideLogo: 'https://www.skyscanner.net/images/airlines/small/OS.png',
					},
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
		return of(this.flights);
	}
}
