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
            picture: 'https://data.whicdn.com/images/25755646/large.jpg'
        },
        {
            enName: 'Test Name1',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
            picture: 'https://thm.arosoftware.com/aro-au-prod-storage.s3-ap-southeast-2.amazonaws.com/wiesner/contacts/7/images/73747-hires_0870.w.460.h.460.zc.T.aoe.1.jpg'
        },
        {
            enName: 'Test Name2',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            picture: 'http://www.resensespas.com/wp-content/uploads/2017/01/Kasha-3_Square_BW_HR.jpg'
        },
        {
            enName: 'Test Name3',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
            picture: 'https://static1.squarespace.com/static/5847844febbd1a711b564d97/t/5ae0eb5e8a922d3043cfab3a/1524689984640/DSC_3624.jpg'
        },
        {
            enName: 'Test Name4',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\'.',
            picture: 'http://www.truebenefits.net/wp-content/uploads/2018/06/Grant-McDonald-bw.jpg'
        },
        {
            enName: 'Test Name5',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
            picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEPPQHwJh2uUXJAUZPBlC0E7C1Qea2436wd6oBCzolmoWJG-W6'
        },
        {
            enName: 'Test Name6',
            enText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.',
            picture: 'https://tmnij3z8ile45i93m2xxow41-wpengine.netdna-ssl.com/wp-content/uploads/2015/08/Tom-BW-1024x678.jpg'
        }
    ];
    private sponsors: Array<any> = [
        { picture: 'https://i.imgur.com/oNFsDQI.png' },
        { picture: 'https://i.imgur.com/iwPHjo2.png' },
        { picture: 'https://i.imgur.com/dmA15iC.png' }
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
