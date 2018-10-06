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
            enName: 'Yara Yehia',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            picture: 'https://i.imgur.com/snNiy42.jpg'
        },
        {
            enName: 'Test Name1',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
            picture: 'https://i.imgur.com/fXRay2S.jpg'
        },
        {
            enName: 'Test Name2',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            picture: 'https://i.imgur.com/o6ele3c.jpg'
        },
        {
            enName: 'Test Name3',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
            picture: 'https://i.imgur.com/PukqOzK.jpg'
        },
        {
            enName: 'Test Name4',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\'.',
            picture: 'https://i.imgur.com/R00WwU5.jpg'
        },
        {
            enName: 'Test Name5',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
            picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEPPQHwJh2uUXJAUZPBlC0E7C1Qea2436wd6oBCzolmoWJG-W6'
        },
        {
            enName: 'Test Name6',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.',
            picture: 'https://i.imgur.com/jNBgVU9.jpg'
        }
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
