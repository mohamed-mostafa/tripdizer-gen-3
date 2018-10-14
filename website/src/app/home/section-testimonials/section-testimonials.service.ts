import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SectionTestimonialService {
    private endPoint = 'public/testimonial' /*+ (lang ? '?lang=' + lang : '')*/;
    private testimonial: Array<any> = [
        {
            enName: 'Rania Saleh',
            enText: 'My family trip to Malaysia was Amazing. The day to day planing couldn’t be better and worth every penny.',
            picture: '../../../assets/img/rania_saleh.jpg'
        },
        {
            enName: 'Shahd Taha',
            enText: `I really enjoyed Bali’s trip so much, you guys made my Honeymoon perfect by recommending the best
            things ever which totally matched what we love. Thanks a million.`,
            picture: '../../../assets/img/shahd_taha.jpg'
        },
        {
            enName: 'Tamer Mohamed',
            enText: `Best website to use if you are looking for a plan that matches your travel style,
            I travelled to Malaysia and Bali and I couldn’t enjoy it more.`,
            picture: '../../../assets/img/tamer_mohamed.jpg'
        },
    ];
    private sponsors: Array<any> = [
        { picture: 'https://i.imgur.com/8QVRpzj.png' },
        { picture: 'https://i.imgur.com/wd0fhgr.jpg' },
        { picture: 'https://i.imgur.com/o6ele3c.jpg' }
    ];

    constructor(private http: HttpClient) { }

    getTestimonials(): Observable<Array<any>> {
        return of(this.testimonial);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }

    getSponsors(): Observable<Array<any>> {
        return of(this.sponsors);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
