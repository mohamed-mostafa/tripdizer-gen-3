import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SectionOurTeamService {
    private endPoint = 'public/team' /*+ (lang ? '?lang=' + lang : '')*/;
    private team: Array<any> = [
        {
            name: 'Yara', jobTitle: 'COO',
            picture: '../../../assets/img/yara.jpg'
        },
        {
            name: 'Sameh', jobTitle: 'CEO',
            picture: '../../../assets/img/sameh.jpg'
        },
        {
            name: 'Hatem', jobTitle: 'CMO',
            picture: '../../../assets/img/hatem.jpg'
        },
        {
            name: 'Mostafa', jobTitle: 'CTO',
            picture: '../../../assets/img/mohamed.jpg'
        },
        {
            name: 'Ziad', jobTitle: 'Business Dev.',
            picture: '../../../assets/img/ziad.jpg'
        }
    ];

    constructor(private http: HttpClient) { }

    getTeamMembers(): Observable<Array<any>> {
        return of(this.team);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
