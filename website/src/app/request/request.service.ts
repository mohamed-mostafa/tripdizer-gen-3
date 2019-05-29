import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DropDownItem } from '../shared/models/drop-down-item.model';
import { TrackingService } from '../shared/services/tracking.service';
/* Models */
import { BudgetCategory } from './budget/budget-category.model';
import { Destination } from './destinations/destination.model';
import { EstimatedCostRequest, EstimatedCostResponse } from './estimated-cost/estimated-cost.model';
import { LUTPreference, Preference } from './preferences/preference.model';
import { LUTPurpose, Purpose } from './purpose/purpose.model';
import {
	RecommendedDestinationsRequest,
	RecommendedDestinationsResponse,
} from './recommended-destinations/recommended-destination.model';
import { RequestRequest, RequestResponse } from './request-dto.model';
import { RequestType } from './request-type.enum';
import { Request } from './request.model';
import { Step } from './step.model';
import { Ticket } from './ticket/ticket.model';

@Injectable({
	providedIn: 'root',
})
export class RequestService {
	private endPoint = 'request';
	private requestData;
	private Lookups: {
		destinations: Array<Destination>;
		budgetCategories: Array<BudgetCategory>;
		purposes: Array<Purpose>;
		preferences: Array<Preference>;
		referralTypes: Array<DropDownItem>;
		professions: Array<DropDownItem>;
	} = {} as any;
	private travelersRadioButtonsStart = {};

	isLoading = new Subject<boolean>();
	requestDataChanged = new Subject<{ key: string; value: any; request: Request }>();
	requestNavBarDataChanged = new Subject<{ key: string; value: any; navBar: Array<Step> }>();
	lastRequestId: number;
	isDevelopment = !environment.production;

	constructor(
		private http: HttpClient,
		private router: Router,
		private currencyPipe: CurrencyPipe,
		private translate: TranslateService,
		private trackingService: TrackingService
	) {
		this.initRequest();
	}

	private initRequest(): void {
		this.requestData = new Request(this.currencyPipe, this.translate);
		const savedRequest = localStorage.getItem('request');
		if (savedRequest) {
			try {
				const parsedSavedRequest = JSON.parse(savedRequest);
				const shouldExpired = moment(parsedSavedRequest.date).diff(moment(), 'days') <= 7;
				Object.keys(parsedSavedRequest).forEach(key => this.setProperty(key, parsedSavedRequest[key]));
			} catch (ex) {
				localStorage.removeItem('request');
			}
		}
	}

	private saveRequestState(): void {
		localStorage.setItem('request', JSON.stringify(this.requestData.getPureRequest()));
	}

	private refineStepPath(path: string): string {
		return path.split('/')[0];
	}

	resetRequestState(): void {
		if (!this.isDevelopment) {
			localStorage.removeItem('request');
			this.initRequest();
		}
	}

	setRequestType(params: Params): boolean {
		let requestType = RequestType.HavePlan;
		if (params.hasOwnProperty('surprise')) {
			requestType = RequestType.SurpriseMe;
		}
		this.requestData.setRequestType(requestType);
		this.requestNavBarDataChanged.next({
			key: 'requestType',
			value: requestType,
			navBar: this.requestData.navBar,
		});
		this.Lookups.purposes = null;
		this.Lookups.preferences = null;
		return true;
	}

	getRequestType(): RequestType {
		return this.requestData.getRequestType();
	}

	getNavBar(): Array<Step> {
		return this.requestData.navBar;
	}

	redirectIfShouldBeRedirected(stepPath: string): void {
		stepPath = this.refineStepPath(stepPath);
		const prevInvalidStep = this.getPrevInvalidStep(stepPath);
		if (prevInvalidStep !== stepPath) {
			this.router.navigate(['../request/', prevInvalidStep]);
		}
	}

	stepVisited(stepPath: string): void {
		stepPath = this.refineStepPath(stepPath);
		const step: Step = this.requestData.validSteps.find(s => s.path === stepPath);
		if (step) {
			this.requestData.touchStep(step.order);
		}
	}

	getNextStep(stepPath: string): string {
		stepPath = this.refineStepPath(stepPath);
		const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
			nextSteps = this.requestData.validSteps
				.filter(s => s.order > currentStep.order)
				.sort((a, b) => a.order - b.order);
		return nextSteps[0] ? nextSteps[0].path : currentStep.path;
	}

	getPrevStep(stepPath: string): string {
		stepPath = this.refineStepPath(stepPath);
		const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
			prevSteps = this.requestData.validSteps
				.filter(s => s.order < currentStep.order)
				.sort((a, b) => b.order - a.order);
		return prevSteps[0] ? prevSteps[0].path : currentStep.path;
	}

	getPrevInvalidStepForRecommendedDestinations(stepPath: string): string {
		stepPath = this.refineStepPath(stepPath);
		const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
			prevSteps = this.requestData.validSteps
				.filter(s => s.requiredForRecommendation && s.order < currentStep.order)
				.sort((a, b) => a.order - b.order);
		for (let i = 0; i < prevSteps.length; ++i) {
			if (!prevSteps[i].isValid()) {
				return prevSteps[i].path;
			}
		}
		return currentStep.path;
	}

	getPrevInvalidStepForEstimateCalc(stepPath: string): string {
		stepPath = this.refineStepPath(stepPath);
		const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
			prevSteps = this.requestData.validSteps
				.filter(s => s.requiredForEstimateCalc && s.order < currentStep.order)
				.sort((a, b) => a.order - b.order);
		for (let i = 0; i < prevSteps.length; ++i) {
			if (!prevSteps[i].isValid()) {
				return prevSteps[i].path;
			}
		}
		return currentStep.path;
	}

	getPrevInvalidStep(stepPath: string): string {
		stepPath = this.refineStepPath(stepPath);
		const currentStep = this.requestData.validSteps.find(s => s.path === stepPath),
			prevSteps = this.requestData.validSteps
				.filter(s => s.order < currentStep.order)
				.sort((a, b) => a.order - b.order);
		for (let i = 0; i < prevSteps.length; ++i) {
			if (!prevSteps[i].isValid()) {
				return prevSteps[i].path;
			}
		}
		return currentStep.path;
	}

	setProperty(key: string, value: any): void {
		this.requestData[key] = value;
		this.requestDataChanged.next({
			key: key,
			value: this.requestData[key],
			request: this.requestData,
		});
		this.requestNavBarDataChanged.next({
			key: key,
			value: this.requestData.validSteps.find(s => s.key === key),
			navBar: this.requestData.navBar,
		});
		if (this.isDevelopment) {
			this.saveRequestState();
		}
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
		return observable.pipe(
			map(destinations => {
				this.Lookups.destinations = destinations;
				this.isLoading.next(false);
				return this.Lookups.destinations;
			})
		);
	}

	setTravelersRadioButtonsStart(controlName: string, increase: boolean, decrease: boolean): void {
		if (!this.travelersRadioButtonsStart[controlName]) {
			this.travelersRadioButtonsStart[controlName] = 0;
		}
		if (increase) {
			++this.travelersRadioButtonsStart[controlName];
		}
		if (decrease) {
			--this.travelersRadioButtonsStart[controlName];
		}
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
		return observable.pipe(
			map(budgetCategories => {
				this.Lookups.budgetCategories = budgetCategories;
				this.isLoading.next(false);
				return this.Lookups.budgetCategories;
			})
		);
	}

	getPurposes(): Observable<Array<Purpose>> {
		this.isLoading.next(true);
		let observable: Observable<Array<Purpose>>;
		if (this.Lookups.purposes) {
			observable = of(this.Lookups.purposes);
		} else {
			observable = this.http.get<Array<Purpose>>('purposes');
		}
		return observable.pipe(
			map(purposes => {
				if (this.getRequestType() === RequestType.SurpriseMe) {
					this.Lookups.purposes = purposes.filter(p => p.id !== LUTPurpose.Other);
				} else {
					this.Lookups.purposes = purposes;
				}
				this.isLoading.next(false);
				return this.Lookups.purposes;
			})
		);
	}

	addPreference(preference: Preference): void {
		this.requestData.addPreference(preference);
		this.requestDataChanged.next({
			key: 'preferences',
			value: this.requestData['preferences'],
			request: this.requestData,
		});
		this.requestNavBarDataChanged.next({
			key: 'preferences',
			value: this.requestData.validSteps.find(s => s.key === 'preferences'),
			navBar: this.requestData.navBar,
		});
	}

	resetPreference(): void {
		this.requestData.resetPreference();
	}

	isPreferenceSelected(preferenceId: string): boolean {
		return this.requestData.isPreferenceSelected(parseInt(preferenceId, 10));
	}

	getPreferenceName(preferenceId: string): string {
		return this.requestData.getPreferenceName(parseInt(preferenceId, 10));
	}

	getPreferences(): Observable<Array<Preference>> {
		this.isLoading.next(true);
		let observable: Observable<Array<Preference>>;
		if (this.Lookups.preferences) {
			observable = of(this.Lookups.preferences);
		} else {
			observable = this.http.get<Array<Preference>>('interests');
		}
		return observable.pipe(
			map(preferences => {
				if (this.getRequestType() === RequestType.SurpriseMe) {
					this.Lookups.preferences = preferences.filter(p => p.id !== LUTPreference.Other);
				} else {
					this.Lookups.preferences = preferences;
				}
				this.isLoading.next(false);
				return this.Lookups.preferences;
			})
		);
	}

	isValidForRecommendedDestinations(): boolean {
		return this.requestData.isValidForRecommendedDestinations();
	}

	getRecommendedDestinations(): Observable<Array<RecommendedDestinationsResponse> | null> {
		this.isLoading.next(true);
		if (this.isValidForRecommendedDestinations()) {
			const recommendedDestinationsRequest = RecommendedDestinationsRequest.getRecommendedDestinationsRequestFromRequest(
				this.requestData
			);
			return this.http
				.post<Array<RecommendedDestinationsResponse>>(`${this.endPoint}/recommendation`, {
					request: recommendedDestinationsRequest,
				})
				.pipe(
					map(recommendedDestinations => {
						this.isLoading.next(false);
						return recommendedDestinations;
					})
				);
		}
		return of(null).pipe(finalize(() => this.isLoading.next(false)));
	}

	isValidForEstimatedCost(): boolean {
		return this.requestData.isValidForEstimatedCost();
	}

	getEstimatedCost(): Observable<EstimatedCostResponse | null> {
		this.isLoading.next(true);
		if (this.isValidForEstimatedCost()) {
			const estimatedCostRequest = EstimatedCostRequest.getEstimatedCostRequestFromRequest(this.requestData);
			return this.http
				.post<EstimatedCostResponse>(`${this.endPoint}/budgetcalc`, { request: estimatedCostRequest })
				.pipe(
					map((estimatedCostResponse: EstimatedCostResponse) => {
						this.setProperty('estimatedCost', estimatedCostResponse.totalBudget);
						this.isLoading.next(false);
						return estimatedCostResponse;
					})
				);
		}
		return of(null).pipe(finalize(() => this.isLoading.next(false)));
	}

	validatePromoCode(promoCode: string): Observable<boolean> {
		return this.http.get<boolean>(`${this.endPoint}/promocodevalidity`, { params: { promoCode: promoCode } }).pipe(
			map(isValid => {
				if (isValid) {
					this.setProperty('promoCode', promoCode);
				} else {
					this.setProperty('promoCode', null);
				}
				return isValid;
			})
		);
	}

	getProfessions(): Observable<Array<DropDownItem> | null> {
		this.isLoading.next(true);
		let observable: Observable<Array<DropDownItem>>;
		if (this.Lookups.professions) {
			observable = of(this.Lookups.professions);
		} else {
			observable = this.http.get<Array<DropDownItem>>('professions');
		}
		return observable.pipe(
			map(professions => {
				this.Lookups.professions = professions;
				this.isLoading.next(false);
				return this.Lookups.professions;
			})
		);
	}

	getReferralTypes(): Observable<Array<DropDownItem> | null> {
		this.isLoading.next(true);
		let observable: Observable<Array<DropDownItem>>;
		if (this.Lookups.referralTypes) {
			observable = of(this.Lookups.referralTypes);
		} else {
			observable = this.http.get<Array<DropDownItem>>('referralTypes');
		}
		return observable.pipe(
			map(referralTypes => {
				this.Lookups.referralTypes = referralTypes;
				this.isLoading.next(false);
				return this.Lookups.referralTypes;
			})
		);
	}

	isValid(): boolean {
		return this.requestData.isValid();
	}

	submitRequest(): Observable<Ticket | null> {
		this.isLoading.next(true);
		if (this.isValid()) {
			const request = RequestRequest.getRequestRequestFromRequest(this.requestData);
			return this.http.put<RequestResponse>(`${this.endPoint}/website/place`, { request: request }).pipe(
				map(requestResponse => {
					const ticket = Ticket.getTicketFromRequestResponse(this.requestData, requestResponse);
					this.lastRequestId = ticket.id;
					this.trackingService.track('Submit Request', { requestId: ticket.id });
					this.resetRequestState();
					this.isLoading.next(false);
					return ticket;
				})
			);
		}
		return of(null).pipe(finalize(() => this.isLoading.next(false)));
	}

	sendPackageByMail(): void {
		this.isLoading.next(true);
		this.http
			.post<Boolean>(`${this.endPoint}/send-package`, { requestId: this.lastRequestId })
			.pipe(finalize(() => this.isLoading.next(false)))
			.subscribe(() => {});
	}
}
