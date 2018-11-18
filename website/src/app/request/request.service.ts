import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/* Models */
import { BudgetCategory } from './budget/budget-category.model';
import { Destination } from './destinations/destination.model';
import { EstimatedCostRequest, EstimatedCostResponse } from './estimated-cost/estimated-cost.model';
import { Preference } from './preferences/preference.model';
import { Purpose } from './purpose/purpose.model';
import { RecommendedDestinationsRequest, RecommendedDestinationsResponse } from './recommended-destinations/recommended-destination.model';
import { RequestRequest, RequestResponse } from './request-dto.model';
import { RequestType } from './request-type.model';
import { Request } from './request.model';
import { Step } from './step.model';
import { Ticket } from './ticket/ticket.model';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    private endPoint = 'request';
    private requestData = new Request();
    private Lookups: {
        destinations: Array<Destination>,
        budgetCategories: Array<BudgetCategory>,
        purposes: Array<Purpose>,
        preferences: Array<Preference>,
        referralTypes: Array<{ id: number, name: string }>
    } = {} as any;
    private travelersRadioButtonsStart = {};

    isLoading = new Subject<boolean>();
    requestDataChanged = new Subject<{ key: string, value: any, request: Request }>();
    requestNavBarDataChanged = new Subject<{ key: string, value: any, navBar: Array<Step> }>();

    constructor(private http: HttpClient) { }

    setRequestType(params: Params): boolean {
        let requestType = RequestType.HavePlan;
        if (params.hasOwnProperty('surprise')) {
            requestType = RequestType.SurpriseMe;
        }
        this.requestData.setRequestType(requestType);
        this.requestNavBarDataChanged.next({
            key: 'requestType',
            value: requestType,
            navBar: this.requestData.navBar
        });
        return true;
    }

    getNavBar(): Array<Step> {
        return this.requestData.navBar;
    }

    stepVisited(stepPath: string): void {
        const step = this.requestData.validSteps.find(s => s.path === stepPath);
        if (step) { this.requestData.touchedSteps = step.order; }
    }

    getNextStep(stepPath: string): string {
        const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
            nextSteps = this.requestData.validSteps
                .filter(s => s.order > currentStep.order)
                .sort((a, b) => a.order - b.order);
        return nextSteps[0] ? nextSteps[0].path : currentStep.path;
    }

    getPrevStep(stepPath: string): string {
        const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
            prevSteps = this.requestData.validSteps
                .filter(s => s.order < currentStep.order)
                .sort((a, b) => b.order - a.order);
        return prevSteps[0] ? prevSteps[0].path : currentStep.path;
    }

    getPrevInvalidStepForRecommendedDestinations(stepPath: string): string {
        const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
            prevSteps = this.requestData.validSteps
                .filter(s => s.requiredForRecommendation && s.order < currentStep.order)
                .sort((a, b) => b.order - a.order);
        for (let i = 0; i < prevSteps.length; ++i) {
            if (!prevSteps[i].isValid()) { return prevSteps[i].path; }
        }
        return currentStep.path;
    }

    getPrevInvalidStepForEstimateCalc(stepPath: string): string {
        const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
            prevSteps = this.requestData.validSteps
                .filter(s => s.requiredForEstimateCalc && s.order < currentStep.order)
                .sort((a, b) => b.order - a.order);
        for (let i = 0; i < prevSteps.length; ++i) {
            if (!prevSteps[i].isValid()) { return prevSteps[i].path; }
        }
        return currentStep.path;
    }

    getPrevInvalidStep(stepPath: string): string {
        const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
            prevSteps = this.requestData.validSteps
                .filter(s => s.order < currentStep.order)
                .sort((a, b) => b.order - a.order);
        for (let i = 0; i < prevSteps.length; ++i) {
            if (!prevSteps[i].isValid()) { return prevSteps[i].path; }
        }
        return currentStep.path;
    }

    setProperty(key: string, value: any): void {
        this.requestData[key] = value;
        this.requestDataChanged.next({
            key: key,
            value: this.requestData[key],
            request: this.requestData
        });
        this.requestNavBarDataChanged.next({
            key: key,
            value: this.requestData.validSteps.find(s => s.key === key),
            navBar: this.requestData.navBar
        });
    }

    getProperty(key: string): any {
        return this.requestData[key];
    }

    getDestinations(): Observable<Array<Destination>> {
        this.isLoading.next(true);
        let observable: Observable<Array<Destination>>;
        if (this.Lookups.destinations) {
            observable = of(this.Lookups.destinations);
        } else {
            observable = this.http.get<Array<Destination>>('itineraries');
        }
        return observable.pipe(map(destinations => {
            this.Lookups.destinations = destinations;
            this.isLoading.next(false);
            return destinations;
        }));
    }

    setTravelersRadioButtonsStart(controlName: string, increase: boolean, decrease: boolean): void {
        if (!this.travelersRadioButtonsStart[controlName]) {
            this.travelersRadioButtonsStart[controlName] = 0;
        }
        if (increase) { ++this.travelersRadioButtonsStart[controlName]; }
        if (decrease) { --this.travelersRadioButtonsStart[controlName]; }
        if (this.travelersRadioButtonsStart[controlName] < 0) {
            this.travelersRadioButtonsStart[controlName] = 0;
        }
    }

    getTravelersRadioButtonsStart(controlName: string): number {
        return this.travelersRadioButtonsStart[controlName] || 0;
    }

    getBudgetCategories(): Observable<Array<BudgetCategory>> {
        this.isLoading.next(true);
        let observable: Observable<Array<BudgetCategory>>;
        if (this.Lookups.budgetCategories) {
            observable = of(this.Lookups.budgetCategories);
        } else {
            observable = this.http.get<Array<BudgetCategory>>('budgetcategories');
        }
        return observable.pipe(map(budgetCategories => {
            this.Lookups.budgetCategories = budgetCategories;
            this.isLoading.next(false);
            return budgetCategories;
        }));
    }

    getPurposes(): Observable<Array<Purpose>> {
        this.isLoading.next(true);
        let observable: Observable<Array<Purpose>>;
        if (this.Lookups.purposes) {
            observable = of(this.Lookups.purposes);
        } else {
            observable = this.http.get<Array<Purpose>>('purposes');
        }
        return observable.pipe(map(purposes => {
            this.Lookups.purposes = purposes;
            this.isLoading.next(false);
            return purposes;
        }));
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
            value: this.requestData.validSteps.find(s => s.key === 'preferences'),
            navBar: this.requestData.navBar
        });
    }

    resetPreference(): void {
        this.requestData.resetPreference();
    }

    isPreferenceSelected(preferenceId: string): boolean {
        return this.requestData.isPreferenceSelected(parseInt(preferenceId, 10));
    }

    getPreferences(): Observable<Array<Preference>> {
        this.isLoading.next(true);
        let observable: Observable<Array<Preference>>;
        if (this.Lookups.preferences) {
            observable = of(this.Lookups.preferences);
        } else {
            observable = this.http.get<Array<Preference>>('interests');
        }
        return observable.pipe(map(preferences => {
            this.Lookups.preferences = preferences;
            this.isLoading.next(false);
            return preferences;
        }));
    }

    isValidForRecommendedDestinations(): boolean {
        return this.requestData.isValidForRecommendedDestinations();
    }

    getRecommendedDestinations(): Observable<Array<RecommendedDestinationsResponse> | null> {
        this.isLoading.next(true);
        if (this.isValidForRecommendedDestinations()) {
            const recommendedDestinationsRequest =
                RecommendedDestinationsRequest.getRecommendedDestinationsRequestFromRequest(this.requestData);
            return this.http.post<Array<RecommendedDestinationsResponse>>
                (`${this.endPoint}/recommendation`, { request: recommendedDestinationsRequest })
                .pipe(map(recommendedDestinations => { this.isLoading.next(false); return recommendedDestinations; }));
        }
        return of(null);
    }

    isValidForEstimatedCost(): boolean {
        return this.requestData.isValidForEstimatedCost();
    }

    getEstimatedCost(): Observable<EstimatedCostResponse | null> {
        this.isLoading.next(true);
        if (this.isValidForEstimatedCost()) {
            const estimatedCostRequest = EstimatedCostRequest.getEstimatedCostRequestFromRequest(this.requestData);
            return this.http.post<EstimatedCostResponse>(`${this.endPoint}/budgetcalc`, { request: estimatedCostRequest })
                .pipe(map((estimatedCostResponse: EstimatedCostResponse) => {
                    this.setProperty('estimatedCost', estimatedCostResponse.totalBudget);
                    this.isLoading.next(false);
                    return estimatedCostResponse;
                }));
        }
        return of(null);
    }

    getReferralTypes(): Observable<Array<any> | null> {
        this.isLoading.next(true);
        let observable: Observable<Array<any>>;
        if (this.Lookups.referralTypes) {
            observable = of(this.Lookups.referralTypes);
        } else {
            observable = this.http.get<Array<any>>('referralTypes');
        }
        return observable.pipe(map(referralTypes => {
            this.Lookups.referralTypes = referralTypes;
            this.isLoading.next(false);
            return referralTypes;
        }));
    }

    isValid(): boolean {
        return this.requestData.isValid();
    }

    submitRequest(): Observable<Ticket | null> {
        this.isLoading.next(true);
        if (this.isValid()) {
            const request = RequestRequest.getRequestRequestFromRequest(this.requestData);
            return this.http.put<RequestResponse>(`${this.endPoint}/place`, { request: request })
                .pipe(map(requestResponse => {
                    this.isLoading.next(false);
                    return Ticket.getTicketFromRequestResponse(this.requestData, requestResponse);
                }));
        }
        return of(null);
    }

}
