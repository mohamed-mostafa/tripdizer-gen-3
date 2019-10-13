import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SectionTestimonialService {
	// private endPoint = 'master-data/public/testimonial' + (lang ? '?lang=' + lang : '');
	private testimonial: Array<any> = [
		{
			name: 'Shahinaz Ashraf',
			// tslint:disable-next-line: max-line-length
			text: `Recommended for sure! Such an excellent and very fast service! Thank you for making my trip comfortable, affordable and memorable!`,
			picture: '../../../assets/img/testmonials/shahinaz_ashraf.jpg',
		},
		{
			name: 'Mariom Touta',
			// tslint:disable-next-line: max-line-length
			text: `Best teamwork best planning upon your budget they choose the best to enjoy if u need something they are always on call helping and supporting offering u things and u choose what u want they don't force u to do or pay something u dont really best travel experience.`,
			picture: '../../../assets/img/testmonials/mariom_touta.jpg',
		},
		{
			name: 'Mohamed Abd El-Raouf',
			// tslint:disable-next-line: max-line-length
			text: `An experienced people to deal with knowing every single details about every country. they arranged our honeymoon perfectly with no Mistake starting from flights , hotels ,programmes, even the drivers. would totally recommend to everyone.`,
			picture: '../../../assets/img/testmonials/mohamed_abd_el-raouf.jpg',
		},
		{
			name: 'Amal Mohsen',
			// tslint:disable-next-line: max-line-length
			text: `Tripdizer is the best travel agency ever, they helped me plan my dream honeymoon, I actually consulted several agencies and Tripdizer were the best prices by far. The team are very friendly and understanding to all our requirements. They very organized they prepared everything for us ahead of the trip. Will definitely deal with them in future trips.`,
			picture: '../../../assets/img/testmonials/amal_mohsen.jpg',
		},
		{
			name: 'Mariham Magdy',
			// tslint:disable-next-line: max-line-length
			text: `Thanks a lot for arranging my trip. Tripdizer is actually a very helpful & considerate team. I felt I was dealing with my family not an external agency. You really cared a lot to help me have a safe and easy trip and did your best to accommodate all my special requests. Immediate responses whenever needed and quick support! I would love to arrange my future trips with you again! Wish you all the best!`,
			picture: '../../../assets/img/testmonials/mariham_magdy.jpg',
		},
	];

	constructor(private http: HttpClient) {}

	getTestimonials(): Observable<Array<any>> {
		return of(this.testimonial);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}
}
