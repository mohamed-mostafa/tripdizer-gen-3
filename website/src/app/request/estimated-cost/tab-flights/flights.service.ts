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
			price: 28970.0,
			currency: 'EGP',
			flightLegs: [
				{
					origin: 'CAI',
					destination: 'AMS',
					totalDurationInWords: '21 h, 50 m',
					transitDurationInWords: '15 h, 25 m',
					totalDurationInMinutes: 1310,
					transitDurationInMinutes: 925,
					segments: [
						{
							origin: 'CAI',
							destination: 'KBP',
							departure: '2019-07-10T14:05:00+02:00',
							return: '2019-07-10T18:25:00+03:00',
							durationInWords: '3 h, 20 m',
							durationInMinutes: 200,
						},
						{
							origin: 'KBP',
							destination: 'AMS',
							departure: '2019-07-11T09:50:00+03:00',
							return: '2019-07-11T11:55:00+02:00',
							durationInWords: '3 h, 5 m',
							durationInMinutes: 185,
						},
					],
					carrier: {
						iataCode: 'PS',
						name: 'UKRAINE INTL AIRLINES',
					},
				},
				{
					origin: 'AMS',
					destination: 'CAI',
					totalDurationInWords: '1 d, 3 h, 20 m',
					transitDurationInWords: '21 h, 15 m',
					totalDurationInMinutes: 1640,
					transitDurationInMinutes: 1275,
					segments: [
						{
							origin: 'AMS',
							destination: 'KBP',
							departure: '2019-07-18T09:30:00+02:00',
							return: '2019-07-18T13:15:00+03:00',
							durationInWords: '2 h, 45 m',
							durationInMinutes: 165,
						},
						{
							origin: 'KBP',
							destination: 'CAI',
							departure: '2019-07-19T10:30:00+03:00',
							return: '2019-07-19T12:50:00+02:00',
							durationInWords: '3 h, 20 m',
							durationInMinutes: 200,
						},
					],
					carrier: {
						iataCode: 'PS',
						name: 'UKRAINE INTL AIRLINES',
					},
				},
			],
		},
		{
			price: 30166.0,
			currency: 'EGP',
			flightLegs: [
				{
					origin: 'CAI',
					destination: 'AMS',
					totalDurationInWords: '13 h, 10 m',
					transitDurationInWords: '7 h, 10 m',
					totalDurationInMinutes: 790,
					transitDurationInMinutes: 430,
					segments: [
						{
							origin: 'CAI',
							destination: 'FCO',
							departure: '2019-07-10T03:30:00+02:00',
							return: '2019-07-10T07:00:00+02:00',
							durationInWords: '3 h, 30 m',
							durationInMinutes: 210,
						},
						{
							origin: 'FCO',
							destination: 'AMS',
							departure: '2019-07-10T14:10:00+02:00',
							return: '2019-07-10T16:40:00+02:00',
							durationInWords: '2 h, 30 m',
							durationInMinutes: 150,
						},
					],
					carrier: {
						iataCode: 'AZ',
						name: 'ALITALIA S.P.A. IN A.S',
					},
				},
				{
					origin: 'AMS',
					destination: 'CAI',
					totalDurationInWords: '1 d, 4 h',
					transitDurationInWords: '22 h, 30 m',
					totalDurationInMinutes: 1680,
					transitDurationInMinutes: 1350,
					segments: [
						{
							origin: 'AMS',
							destination: 'FCO',
							departure: '2019-07-18T12:05:00+02:00',
							return: '2019-07-18T14:20:00+02:00',
							durationInWords: '2 h, 15 m',
							durationInMinutes: 135,
						},
						{
							origin: 'FCO',
							destination: 'CAI',
							departure: '2019-07-19T12:50:00+02:00',
							return: '2019-07-19T16:05:00+02:00',
							durationInWords: '3 h, 15 m',
							durationInMinutes: 195,
						},
					],
					carrier: {
						iataCode: 'AZ',
						name: 'ALITALIA S.P.A. IN A.S',
					},
				},
			],
		},
		{
			price: 30166.0,
			currency: 'EGP',
			flightLegs: [
				{
					origin: 'CAI',
					destination: 'AMS',
					totalDurationInWords: '13 h, 10 m',
					transitDurationInWords: '7 h, 10 m',
					totalDurationInMinutes: 790,
					transitDurationInMinutes: 430,
					segments: [
						{
							origin: 'CAI',
							destination: 'FCO',
							departure: '2019-07-10T03:30:00+02:00',
							return: '2019-07-10T07:00:00+02:00',
							durationInWords: '3 h, 30 m',
							durationInMinutes: 210,
						},
						{
							origin: 'FCO',
							destination: 'AMS',
							departure: '2019-07-10T14:10:00+02:00',
							return: '2019-07-10T16:40:00+02:00',
							durationInWords: '2 h, 30 m',
							durationInMinutes: 150,
						},
					],
					carrier: {
						iataCode: 'AZ',
						name: 'ALITALIA S.P.A. IN A.S',
					},
				},
				{
					origin: 'AMS',
					destination: 'CAI',
					totalDurationInWords: '22 h, 35 m',
					transitDurationInWords: '17 h, 5 m',
					totalDurationInMinutes: 1355,
					transitDurationInMinutes: 1025,
					segments: [
						{
							origin: 'AMS',
							destination: 'FCO',
							departure: '2019-07-18T17:30:00+02:00',
							return: '2019-07-18T19:45:00+02:00',
							durationInWords: '2 h, 15 m',
							durationInMinutes: 135,
						},
						{
							origin: 'FCO',
							destination: 'CAI',
							departure: '2019-07-19T12:50:00+02:00',
							return: '2019-07-19T16:05:00+02:00',
							durationInWords: '3 h, 15 m',
							durationInMinutes: 195,
						},
					],
					carrier: {
						iataCode: 'AZ',
						name: 'ALITALIA S.P.A. IN A.S',
					},
				},
			],
		},
	];

	constructor(private http: HttpClient, private requestService: RequestService) {}

	getFlights(): Observable<Array<Flight>> {
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			destination: (this.requestService.getProperty('destination') as Destination).iataCode,
			departure: (this.requestService.getProperty('departureDate') as Moment).toISOString(),
			return: (this.requestService.getProperty('returnDate') as Moment).toISOString(),
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
