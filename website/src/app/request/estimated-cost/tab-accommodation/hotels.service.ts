import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hotel } from './hotel.model';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class HotelsService {
	private endPoint = 'request/hotels' /*+ (lang ? '?lang=' + lang : '')*/;
	private hotels: Array<Hotel> = [
		{
			city: 'rome',
			name: 'Portrait Roma',
			rate: 5,
			address: 'Largo Febo 2, Navona, 00186, Rome, Italy',
			description:
				"Rome’s great gladiatorial arena is the most thrilling of the city's ancient sights.Inaugurated in AD 80, the 50,000- seat Colosseum, also known as the Flavian Amphitheatre, was originally clad in travertine and covered by a huge canvas awning. ",
			image: '../../../assets/img/landmark.jpg',
			price: 1500,
		},
		{
			city: 'rome',
			name: 'Portrait Roma',
			rate: 4,
			address: 'Largo Febo 2, Navona, 00186, Rome, Italy',
			description:
				"Rome’s great gladiatorial arena is the most thrilling of the city's ancient sights.Inaugurated in AD 80, the 50,000- seat Colosseum, also known as the Flavian Amphitheatre, was originally clad in travertine and covered by a huge canvas awning. ",
			image: '../../../assets/img/landmark.jpg',
			price: 1500,
		},
		{
			city: 'rome',
			name: 'Portrait Roma',
			rate: 2,
			address: 'Largo Febo 2, Navona, 00186, Rome, Italy',
			description:
				"Rome’s great gladiatorial arena is the most thrilling of the city's ancient sights.Inaugurated in AD 80, the 50,000- seat Colosseum, also known as the Flavian Amphitheatre, was originally clad in travertine and covered by a huge canvas awning. ",
			image: '../../../assets/img/landmark.jpg',
			price: 1500,
		},
	];

	constructor(private http: HttpClient) {}

	getHotels(): Observable<Array<Hotel>> {
		return of(this.hotels);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}
}
