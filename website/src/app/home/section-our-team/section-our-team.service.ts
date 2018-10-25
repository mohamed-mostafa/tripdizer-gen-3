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
            enName: 'Yara Yehia', enJobTitle: 'Cheif Operations Officer',
            picture: '../../../assets/img/yara.jpg'
        },
        {
            enName: 'Sameh Saleh', enJobTitle: 'Cheif Executive Officer',
            picture: '../../../assets/img/sameh.jpg'
        },
        {
            enName: 'Hatem Ayoub', enJobTitle: 'Cheif Marketing Officer',
            picture: '../../../assets/img/hatem.jpg'
        },
        {
            enName: 'Mohamed Mostafa', enJobTitle: 'Cheif Technical Officer',
            picture: '../../../assets/img/mohamed.jpg'
        },
        {
            enName: 'Ziad El-Adawy', enJobTitle: 'Business Development Manager',
            picture: '../../../assets/img/ziad.jpg'
        }
    ];

    constructor(private http: HttpClient) { }

    getTeamMembers(): Observable<Array<any>> {
        return of(this.team);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
