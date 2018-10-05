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
            picture: 'https://data.whicdn.com/images/25755646/large.jpg'
        },
        {
            enName: 'Test Name1', enJobTitle: 'Test Job Title 1',
            picture: 'https://thm.arosoftware.com/aro-au-prod-storage.s3-ap-southeast-2.amazonaws.com/wiesner/contacts/7/images/73747-hires_0870.w.460.h.460.zc.T.aoe.1.jpg'
        },
        {
            enName: 'Test Name2', enJobTitle: 'Test Job Title 2',
            picture: 'http://www.resensespas.com/wp-content/uploads/2017/01/Kasha-3_Square_BW_HR.jpg'
        },
        {
            enName: 'Test Name3', enJobTitle: 'Test Job Title 3',
            picture: 'https://static1.squarespace.com/static/5847844febbd1a711b564d97/t/5ae0eb5e8a922d3043cfab3a/1524689984640/DSC_3624.jpg'
        },
        {
            enName: 'Test Name4', enJobTitle: 'Test Job Title 4',
            picture: 'http://www.truebenefits.net/wp-content/uploads/2018/06/Grant-McDonald-bw.jpg'
        },
        {
            enName: 'Test Name5', enJobTitle: 'Test Job Title 5',
            picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEPPQHwJh2uUXJAUZPBlC0E7C1Qea2436wd6oBCzolmoWJG-W6'
        },
        {
            enName: 'Test Name6', enJobTitle: 'Test Job Title 6',
            picture: 'https://tmnij3z8ile45i93m2xxow41-wpengine.netdna-ssl.com/wp-content/uploads/2015/08/Tom-BW-1024x678.jpg'
        }
    ];

    constructor(private http: HttpClient) { }

    getTeamMembers(): Observable<Array<any>> {
        return of(this.team);
        // return this.http.get<Array<any>>(`${this.endPoint}s`);
    }
}
