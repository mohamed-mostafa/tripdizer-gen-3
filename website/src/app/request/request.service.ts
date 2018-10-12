import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Request } from './request.model';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    private endPoint = 'request' /*+ (lang ? '?lang=' + lang : '')*/;
    private requestData = new Request();

    requestDataChanged = new Subject<{ key: string, value: any }>();

    constructor(private http: HttpClient) { }

    setProperty(key: string, value: any): void {
        this.requestData[key] = value;
        this.requestDataChanged.next({ key: key, value: this.requestData[key] });
    }

    getProperty(key: string): any {
        return this.requestData[key];
    }

    getNavBarProperty(key: string): any {
        return this.requestData.navBar[key];
    }
}
