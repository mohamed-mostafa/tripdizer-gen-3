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
            picture: 'https://i.imgur.com/snNiy42.jpg'
        },
        {
            enName: 'Sameh Saleh', enJobTitle: 'Cheif Executive Officer',
            picture: 'https://i.imgur.com/fXRay2S.jpg'
        },
        {
            enName: 'Ziad El-Adawy', enJobTitle: 'Business Development Manager',
            picture: 'https://i.imgur.com/uAOptZ5.jpg'
        },
        {
            enName: 'Hatem Ayoub', enJobTitle: 'Cheif Marketing Officer',
            picture: 'https://i.imgur.com/PukqOzK.jpg'
        },
        {
            enName: 'Mohamed Mostafa', enJobTitle: 'Cheif Technical Officer',
            picture: 'https://i.imgur.com/R00WwU5.jpg'
        }
    ];

    constructor(private http: HttpClient) { }

    getTeamMembers(): Observable<Array<any>> {
        return of(this.team);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
