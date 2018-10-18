import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/* Models */
import { BudgetCategory } from './budget/budget-category.model';
import { Purpose } from './purpose/purpose.model';
import { Request } from './request.model';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    private endPoint = 'request' /*+ (lang ? '?lang=' + lang : '')*/;
    private requestData = new Request();

    requestDataChanged = new Subject<{ key: string, value: any }>();
    requestNavBarDataChanged = new Subject<{ key: string, value: any }>();

    constructor(private http: HttpClient) { }

    setProperty(key: string, value: any): void {
        this.requestData[key] = value;
        this.requestDataChanged.next({ key: key, value: this.requestData[key] });
        this.requestNavBarDataChanged.next({ key: key, value: this.requestData.navBar[key] });
    }

    getProperty(key: string): any {
        return this.requestData[key];
    }

    getNavBarProperty(key: string): any {
        return this.requestData.navBar[key];
    }

    getBudgetCategories(lang: string): Observable<Array<BudgetCategory>> {
        return this.http.get<Array<BudgetCategory>>('budgetcategories' + (lang ? '?lang=' + lang : ''));
    }

    getPurposes(lang: string): Observable<Array<Purpose>> {
        return this.http.get<Array<Purpose>>('purposes' + (lang ? '?lang=' + lang : ''))
            .pipe(map(purposes => purposes.map(purpose => ({
                ...purpose,
                image: `https://picsum.photos/200?image=${Math.floor(Math.random() * 999)}`
            }))));
    }

}
