import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SectionVideosService {
    private endPoint = 'public/video' /*+ (lang ? '?lang=' + lang : '')*/;

    constructor(private http: HttpClient) { }

    getVideos(): Observable<Array<any>> {
        return of([
            {
                'id': 1,
                'en_name': 'Bali',
                'en_description': 'Bali Guide',
                'ar_name': 'بالي',
                'ar_description': 'دليل جزيرة بالي',
                'uri': 'https://www.youtube.com/embed/Vsa2WZHRmcY'
            },
            {
                'id': 2,
                'en_name': 'cape town',
                'en_description': 'cape town before day zero',
                'ar_name': 'كيب تاون',
                'ar_description': 'كيب تاون قبل يوم الصفر',
                'uri': 'https://www.youtube.com/embed/CrjH9sk3g9Y'
            },
            {
                'id': 3,
                'en_name': 'Kuala Lumpur',
                'en_description': 'Things to do in KL',
                'ar_name': 'كوالا لامبور',
                'ar_description': 'أشياء يمكن ممارستها في كوالا لامبور',
                'uri': 'https://www.youtube.com/embed/MOD4cpZmImk'
            },
            {
                'id': 4,
                'en_name': 'Hong Kong',
                'en_description': '10 things to do in Hong Kong',
                'ar_name': 'هونج كونج',
                'ar_description': 'عشرة أنشطة يمكن ممارستها في هونج كونج',
                'uri': 'https://www.youtube.com/embed/hkYDiTXo6dU'
            }
        ]);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
