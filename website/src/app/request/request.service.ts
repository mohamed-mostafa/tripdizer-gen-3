import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/* Models */
import { BudgetCategory } from './budget/budget-category.model';
import { Destination } from './destinations/destination.model';
import { EstimatedCostRequest, EstimatedCostResponse } from './estimated-cost/estimated-cost.model';
import { Preference } from './preferences/preference.model';
import { Purpose } from './purpose/purpose.model';
import { RecommendedDestinationsRequest, RecommendedDestinationsResponse } from './recommended-destinations/recommended-destination.model';
import { Request } from './request.model';
import { Step } from './step.model';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    private endPoint = 'request';
    private requestData = new Request();

    requestDataChanged = new Subject<{ key: string, value: any, request: Request }>();
    requestNavBarDataChanged = new Subject<{ key: string, value: any, navBar: Array<Step> }>();

    constructor(private http: HttpClient) { }

    stepVisited(stepPath: string): void {
        const step = this.requestData.steps.find(s => s.path === stepPath);
        if (step) { this.requestData.touchedSteps = step.order; }
    }

    getNextStep(stepPath: string): string {
        const currentStep = this.requestData.steps.find(s => s.path === stepPath),
            nextSteps = this.requestData.steps
                .filter(s => s.order > currentStep.order)
                .sort((a, b) => a.order - b.order);
        return nextSteps[0] ? nextSteps[0].path : currentStep.path;
    }

    getPrevStep(stepPath: string): string {
        const currentStep = this.requestData.steps.find(s => s.path === stepPath),
            prevSteps = this.requestData.steps
                .filter(s => s.order < currentStep.order)
                .sort((a, b) => b.order - a.order);
        return prevSteps[0] ? prevSteps[0].path : currentStep.path;
    }

    getPrevInvalidStepForRecommendedDestinations(stepPath: string): string {
        const currentStep = this.requestData.steps.find(s => s.path === stepPath),
            prevSteps = this.requestData.steps
                .filter(s => s.requiredForRecommendation && s.order < currentStep.order)
                .sort((a, b) => b.order - a.order);
        for (let i = 0; i < prevSteps.length; ++i) {
            if (!prevSteps[i].isValid()) { return prevSteps[i].path; }
        }
        return currentStep.path;
    }

    getPrevInvalidStepForEstimateCalc(stepPath: string): string {
        const currentStep = this.requestData.steps.find(s => s.path === stepPath),
            prevSteps = this.requestData.steps
                .filter(s => s.requiredForEstimateCalc && s.order < currentStep.order)
                .sort((a, b) => b.order - a.order);
        for (let i = 0; i < prevSteps.length; ++i) {
            if (!prevSteps[i].isValid()) { return prevSteps[i].path; }
        }
        return currentStep.path;
    }

    getPrevInvalidStep(stepPath: string): string {
        const currentStep = this.requestData.steps.find(s => s.path === stepPath),
            prevSteps = this.requestData.steps
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
            value: this.requestData.steps.find(s => s.key === key),
            navBar: this.requestData.steps
        });
    }

    getProperty(key: string): any {
        return this.requestData[key];
    }

    getDestinations(): Observable<Array<Destination>> {
        return this.http.get<Array<Destination>>('itineraries');
    }

    getBudgetCategories(): Observable<Array<BudgetCategory>> {
        return this.http.get<Array<BudgetCategory>>('budgetcategories');
    }

    getPurposes(): Observable<Array<Purpose>> {
        return this.http.get<Array<Purpose>>('purposes')
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
            value: this.requestData.steps.find(s => s.key === 'preferences'),
            navBar: this.requestData.steps
        });
    }

    resetPreference(): void {
        this.requestData.resetPreference();
    }

    isPreferenceSelected(preferenceId: string): boolean {
        return this.requestData.isPreferenceSelected(parseInt(preferenceId, 10));
    }

    getPreferences(): Observable<Array<Preference>> {
        return this.http.get<Array<Preference>>('interests')
            .pipe(map(preferences => preferences.map(preference => ({
                ...preference,
                image: `https://picsum.photos/200?image=${Math.floor(Math.random() * 999)}`
            }))));
    }

    isValidForRecommendedDestinations(): boolean {
        return this.requestData.isValidForRecommendedDestinations();
    }

    getRecommendedDestinations(): Observable<Array<RecommendedDestinationsResponse> | null> {
        if (this.isValidForRecommendedDestinations()) {
            const recommendedDestinationsRequest =
                RecommendedDestinationsRequest.getRecommendedDestinationsRequestFromRequest(this.requestData);
            return this.http.post<Array<RecommendedDestinationsResponse>>
                (`${this.endPoint}/recommendation`, { request: recommendedDestinationsRequest });
        }
        return of(null);
    }

    isValidForEstimatedCost(): boolean {
        return this.requestData.isValidForEstimatedCost();
    }

    getEstimatedCost(): Observable<EstimatedCostResponse | null> {
        if (this.isValidForEstimatedCost()) {
            const estimatedCostRequest = EstimatedCostRequest.getEstimatedCostRequestFromRequest(this.requestData);
            return this.http.post<EstimatedCostResponse>(`${this.endPoint}/budgetcalc`, { request: estimatedCostRequest })
                .pipe(map((estimatedCostResponse: EstimatedCostResponse) => {
                    this.setProperty('estimatedCost', estimatedCostResponse.totalBudget);
                    return estimatedCostResponse;
                }));
        }
        return of(null);
    }

}
