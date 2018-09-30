import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SectionVideosService {
    private endPoint = 'public/video' /*+ (lang ? '?lang=' + lang : '')*/;

    constructor(private http: HttpClient) { }

    getVideos(): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
