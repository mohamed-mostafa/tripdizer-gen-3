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
            enName: 'Yara Yehia', enJobTitle: 'Operation Manager',
            picture: 'https://i.imgur.com/snNiy42.jpg'
        },
        {
            enName: 'Test Name1', enJobTitle: 'Test Job Title 1',
            picture: 'https://i.imgur.com/fXRay2S.jpg'
        },
        {
            enName: 'Test Name2', enJobTitle: 'Test Job Title 2',
            picture: 'https://i.imgur.com/o6ele3c.jpg'
        },
        {
            enName: 'Test Name3', enJobTitle: 'Test Job Title 3',
            picture: 'https://i.imgur.com/PukqOzK.jpg'
        },
        {
            enName: 'Test Name4', enJobTitle: 'Test Job Title 4',
            picture: 'https://i.imgur.com/R00WwU5.jpg'
        },
        {
            enName: 'Test Name5', enJobTitle: 'Test Job Title 5',
            picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEPPQHwJh2uUXJAUZPBlC0E7C1Qea2436wd6oBCzolmoWJG-W6'
        },
        {
            enName: 'Test Name6', enJobTitle: 'Test Job Title 6',
            picture: 'https://i.imgur.com/jNBgVU9.jpg'
        }
    ];

    constructor(private http: HttpClient) { }

    getTeamMembers(): Observable<Array<any>> {
        return of(this.team);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
