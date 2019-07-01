import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CitiesService {

	private endPoint = 'request/cities' /*+ (lang ? '?lang=' + lang : '')*/;
	private cities: Array<any> = [
		{
			country: 'Rome',
			town: 'Italy',
			description: 'Rome’s great gladiatorial arena is the most thrilling of the city\'s ancient sights.Inaugurated in AD 80, the 50,000- seat Colosseum, also known as the Flavian Amphitheatre, was originally clad in travertine and covered by a huge canvas awning. ',
			image: '../../../assets/img/landmark.jpg',
			activies: [
				'Outdoors',
				'Parks',
				'Beaches'
			],
			icons: [
				{ link: '../../../assets/img/svg/family.svg', alt: 'family' },
				{ link: '../../../assets/img/svg/spa.svg', alt: 'spa' },
				{ link: '../../../assets/img/svg/food.svg', alt: 'food' },
				{ link: '../../../assets/img/svg/coffee.svg', alt: 'coffee' }
			]
		}, {
			country: 'Rome',
			town: 'Italy',
			description: 'Rome’s great gladiatorial arena is the most thrilling of the city\'s ancient sights.Inaugurated in AD 80, the 50,000- seat Colosseum, also known as the Flavian Amphitheatre, was originally clad in travertine and covered by a huge canvas awning. ',
			image: '../../../assets/img/landmark.jpg',
			activies: [
				'Outdoors',
				'Parks',
				'Beaches'
			],
			icons: [
				{ link: '../../../assets/img/svg/family.svg', alt: 'family' },
				{ link: '../../../assets/img/svg/spa.svg', alt: 'spa' },
				{ link: '../../../assets/img/svg/food.svg', alt: 'food' },
				{ link: '../../../assets/img/svg/coffee.svg', alt: 'coffee' }
			]
		}, {
			country: 'Rome',
			town: 'Italy',
			description: 'Rome’s great gladiatorial arena is the most thrilling of the city\'s ancient sights.Inaugurated in AD 80, the 50,000- seat Colosseum, also known as the Flavian Amphitheatre, was originally clad in travertine and covered by a huge canvas awning. ',
			image: '../../../assets/img/landmark.jpg',
			activies: [
				'Outdoors',
				'Parks',
				'Beaches'
			],
			icons: [
				{ link: '../../../assets/img/svg/family.svg', alt: 'family' },
				{ link: '../../../assets/img/svg/spa.svg', alt: 'spa' },
				{ link: '../../../assets/img/svg/food.svg', alt: 'food' },
				{ link: '../../../assets/img/svg/coffee.svg', alt: 'coffee' }
			]
		}
	];

	constructor(private http: HttpClient) { }

	getCities(): Observable<Array<any>> {
		return of(this.cities);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}
}
