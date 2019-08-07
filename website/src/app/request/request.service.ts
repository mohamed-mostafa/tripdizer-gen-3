import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BudgetCategory } from '../shared/models/budget-category.model';
import { Country } from '../shared/models/country.model';
import { DropDownItem } from '../shared/models/drop-down-item.model';
import { Preference } from '../shared/models/preference.model';
import { Purpose } from '../shared/models/purpose.model';
import { LookupsService } from '../shared/services/lookups.service';
import { TrackingService } from '../shared/services/tracking.service';
import { EstimatedCostRequest, EstimatedCostResponse } from './estimated-cost/estimated-cost.model';
import {
	RecommendedDestinationsRequest,
	RecommendedDestinationsResponse,
} from './recommended-destinations/recommended-destination.model';
import { RequestRequest, RequestResponse } from './request-dto.model';
import { RequestType } from './request-type.enum';
import { Request } from './request.model';
import { Step } from './step.model';
import { Ticket } from './ticket/ticket.model';

@Injectable({ providedIn: 'root' })
export class RequestService {
	private endPoint = 'requests';
	private LUTEndPoint = 'master-data';
	private requestData;
	private travelersRadioButtonsStart = {};

	isLoading = new Subject<boolean>();
	requestDataChanged = new Subject<{ key: string; value: any; request: Request }>();
	requestNavBarDataChanged = new Subject<{ key: string; value: any; navBar: Array<Step> }>();
	lastRequestId: number;

	isCitiesTabVisited = new BehaviorSubject<boolean>(false);
	isFlightsTabVisited = new BehaviorSubject<boolean>(false);
	isAccommodationTabVisited = new BehaviorSubject<boolean>(false);

	constructor(
		private http: HttpClient,
		private router: Router,
		private currencyPipe: CurrencyPipe,
		private translate: TranslateService,
		private trackingService: TrackingService,
		private lutService: LookupsService
	) {

		this.initRequest();
		this.isLoading = this.lutService.isLoading;
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

	setIsCitiesTabVisited(value: boolean): void {
		this.isCitiesTabVisited.next(value);
	}

	setIsFlightsTabVisited(value: boolean): void {
		this.isFlightsTabVisited.next(value);
	}

	setIsAccommodationTabVisited(value: boolean): void {
		this.isAccommodationTabVisited.next(value);
	}

	resetRequestState(): void {
		if (!environment.saveRequestState) {
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
		this.lutService.removeCachedPurposes();
		this.lutService.removeCachedPreferences();
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
		if (environment.saveRequestState) {
			this.saveRequestState();
		}
	}

	getProperty(key: string): any;
	getProperty<T>(key: string): T;
	getProperty<T>(key: string): T {
		return this.requestData[key];
	}

	getCountries(): Observable<Array<Country>> {
		return this.lutService.getValidCountries();
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
		return this.lutService.getBudgetCategories();
	}

	getPurposes(): Observable<Array<Purpose>> {
		if (this.getRequestType() === RequestType.SurpriseMe) {
			return this.lutService.getPurposesWithoutOther();
		} else {
			return this.lutService.getPurposes();
		}
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
		if (this.getRequestType() === RequestType.SurpriseMe) {
			return this.lutService.getPreferencesWithoutOther();
		} else {
			return this.lutService.getPreferences();
		}
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
				.post<Array<RecommendedDestinationsResponse>>(`${this.LUTEndPoint}/itinerary/recommendation`, {
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
				.post<EstimatedCostResponse>(`${this.LUTEndPoint}/itinerary/budget-calculation`, {
					request: estimatedCostRequest,
				})
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
		return this.http.get<boolean>(`${this.endPoint}/promo-code-validity`, { params: { promoCode: promoCode } }).pipe(
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
		return this.lutService.getProfessions();
	}

	getReferralTypes(): Observable<Array<DropDownItem> | null> {
		return this.lutService.getReferralTypes();
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
			.subscribe(() => { });
	}
}
