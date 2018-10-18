import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/* Models */
import { BudgetCategory } from './budget/budget-category.model';
import { Preference } from './preferences/preference.model';
import { Purpose } from './purpose/purpose.model';
import { Request } from './request.model';
import { IRequestNavBar } from './nav-bar/nav-bar.model';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    private endPoint = 'request' /*+ (lang ? '?lang=' + lang : '')*/;
    private requestData = new Request();

    requestDataChanged = new Subject<{ key: string, value: any, request: Request }>();
    requestNavBarDataChanged = new Subject<{ key: string, value: any, navBar: IRequestNavBar }>();

    constructor(private http: HttpClient) { }

    setProperty(key: string, value: any): void {
        this.requestData[key] = value;
        this.requestDataChanged.next({
            key: key,
            value: this.requestData[key],
            request: this.requestData
        });
        this.requestNavBarDataChanged.next({
            key: key,
            value: this.requestData.navBar[key],
            navBar: this.requestData.navBar
        });
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

    addPreference(preference: Preference): void {
        this.requestData.addPreference(preference);
        this.requestDataChanged.next({
            key: 'preferences',
            value: this.requestData['preferences'],
            request: this.requestData
        });
        this.requestNavBarDataChanged.next({
            key: 'preferences',
            value: this.requestData.navBar['preferences'],
            navBar: this.requestData.navBar
        });
    }

    resetPreference(): void {
        this.requestData.resetPreference();
    }

    isPreferenceSelected(preferenceId: string): boolean {
        return this.requestData.isPreferenceSelected(parseInt(preferenceId, 10));
    }

    getPreferences(lang: string): Observable<Array<Preference>> {
        return this.http.get<Array<Preference>>('interests' + (lang ? '?lang=' + lang : ''))
            .pipe(map(preferences => preferences.map(preference => ({
                ...preference,
                image: `https://picsum.photos/200?image=${Math.floor(Math.random() * 999)}`
            }))));
    }

}
