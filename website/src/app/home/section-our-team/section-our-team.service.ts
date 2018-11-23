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
            name: 'Yara Yehia', jobTitle: 'Cheif Operations Officer',
            picture: '../../../assets/img/yara.jpg'
        },
        {
            name: 'Sameh Saleh', jobTitle: 'Cheif Executive Officer',
            picture: '../../../assets/img/sameh.jpg'
        },
        {
            name: 'Hatem Ayoub', jobTitle: 'Cheif Marketing Officer',
            picture: '../../../assets/img/hatem.jpg'
        },
        {
            name: 'Mohamed Mostafa', jobTitle: 'Cheif Technical Officer',
            picture: '../../../assets/img/mohamed.jpg'
        },
        {
            name: 'Ziad El-Adawy', jobTitle: 'Business Development Manager',
            picture: '../../../assets/img/ziad.jpg'
        }
    ];

    constructor(private http: HttpClient) { }

    getTeamMembers(): Observable<Array<any>> {
        return of(this.team);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
