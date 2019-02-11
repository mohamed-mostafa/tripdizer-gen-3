import { CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CommonFunctions } from '../shared/utils';
import { Destination } from './destinations/destination.model';
import { Preference } from './preferences/preference.model';
import { RequestType } from './request-type.model';
import { IRequester } from './requester.model';
import { Step } from './step.model';
import { TravelingFrom } from './traveling-from/traveling-from.model';

export class Request extends CommonFunctions {
	private _requestType: RequestType;
	private _localeLabels: {
		currency?: any;
		traveling_from?: string;
		traveling_to?: string;
		departure_return?: string;
		travelers?: { title?: string; value?: string };
		budget?: string;
		purpose?: string;
		preferences?: string;
		destinations?: string;
		estimated_cost?: string;
		travel_assistance?: { title?: string; tourGuide?: string; visaAssistance?: string };
		information?: { title?: string; value?: string };
		ticket?: string;
	} = {};
	private _touchedSteps: Array<number>;
	private _travelingFrom: TravelingFrom;
	private _departureDate: moment.Moment;
	private _returnDate: moment.Moment;
	private _isFlexibleDates: boolean;
	private _adultsNumber: number;
	private _kidsNumber: number;
	private _infantsNumber: number;
	private _budget: number;
	private _budgetCategory: number;
	private _budgetCategoryName: string;
	private _purpose: number;
	private _purposeName: string;
	private _preferences: Array<number>;
	private _preferenceNames: Array<string>;
	private _destination: Destination;
	private _estimatedCost: number;
	private _visaAssistanceNeeded: boolean;
	private _tourGuideNeeded: boolean;
	private _promoCode: string;
	private _specialRequests: string;
	private _traveler: IRequester;
	private _referralType: number;

	set travelingFrom(value: TravelingFrom) {
		this._travelingFrom = value;
	}
	get travelingFrom(): TravelingFrom {
		return this._travelingFrom;
	}
	set departureDate(value: moment.Moment) {
		this.resetEstimatedCost();
		this._departureDate = value;
	}
	get departureDate(): moment.Moment {
		return this._departureDate ? moment(this._departureDate) : null;
	}
	set returnDate(value: moment.Moment) {
		this.resetEstimatedCost();
		this._returnDate = value;
	}
	get returnDate(): moment.Moment {
		return this._returnDate ? moment(this._returnDate) : null;
	}
	set isFlexibleDates(value: boolean) {
		this._isFlexibleDates = value;
	}
	get isFlexibleDates(): boolean {
		return this._isFlexibleDates || false;
	}
	set adultsNumber(value) {
		this.resetEstimatedCost();
		this._adultsNumber = parseInt(value.toString(), 10);
		this.translate
			.get('request.nav_bar.travelers.value', { adultsNumber: this._adultsNumber })
			.subscribe(label => this.setAdultsNavBarLabel(label));
	}
	get adultsNumber(): number {
		return this._adultsNumber;
	}
	set kidsNumber(value) {
		this.resetEstimatedCost();
		this._kidsNumber = parseInt(value.toString(), 10);
	}
	get kidsNumber(): number {
		return this._kidsNumber || 0;
	}
	set infantsNumber(value) {
		this.resetEstimatedCost();
		this._infantsNumber = parseInt(value.toString(), 10);
	}
	get infantsNumber(): number {
		return this._infantsNumber || 0;
	}
	set budget(value) {
		this._budget = parseInt(value.toString(), 10);
	}
	get budget(): number {
		return this.budgetCategory === 1 ? this._budget : 0;
	}
	set budgetCategory(value) {
		this.resetEstimatedCost();
		this._budgetCategory = parseInt(value.toString(), 10);
	}
	get budgetCategory(): number {
		return this._budgetCategory || 1;
	}
	set budgetCategoryName(value: string) {
		this._budgetCategoryName = value;
	}
	get budgetCategoryName(): string {
		return this._budgetCategory ? this._budgetCategoryName : '';
	}
	set purpose(value: number) {
		this._purpose = value;
	}
	get purpose(): number {
		return this._purpose;
	}
	set purposeName(value: string) {
		this._purposeName = value;
	}
	get purposeName(): string {
		return this._purpose ? this._purposeName : '';
	}
	get preferences(): Array<number> {
		return this._preferences;
	}
	get preferenceNames(): Array<string> {
		return this._preferenceNames;
	}
	set destination(value: Destination) {
		this.resetEstimatedCost();
		this._destination = value;
	}
	get destination(): Destination {
		return this._destination;
	}
	set estimatedCost(value: number) {
		this._estimatedCost = value;
	}
	get estimatedCost(): number {
		return this._estimatedCost;
	}
	set visaAssistanceNeeded(value: boolean) {
		this._visaAssistanceNeeded = value;
	}
	get visaAssistanceNeeded(): boolean {
		return this._visaAssistanceNeeded || false;
	}
	set tourGuideNeeded(value: boolean) {
		this._tourGuideNeeded = value;
	}
	get tourGuideNeeded(): boolean {
		return this._tourGuideNeeded || false;
	}
	set promoCode(value: string) {
		this._promoCode = value;
	}
	get promoCode(): string {
		return this._promoCode;
	}
	set specialRequests(value: string) {
		this._specialRequests = value;
	}
	get specialRequests(): string {
		return this._specialRequests;
	}
	set travelerName(value: string) {
		this._traveler.name = value;
	}
	get travelerName(): string {
		return this._traveler.name;
	}
	set travelerMobile(value: string) {
		this._traveler.mobile = value;
	}
	get travelerMobile(): string {
		return this._traveler.mobile;
	}
	set travelerEmail(value: string) {
		this._traveler.email = value;
	}
	get travelerEmail(): string {
		return this._traveler.email;
	}
	set travelerBirthday(value: moment.Moment) {
		this._traveler.birthday = value;
	}
	get travelerBirthday(): moment.Moment {
		return this._traveler.birthday ? moment(this._traveler.birthday) : null;
	}
	get traveler(): IRequester {
		return this._traveler;
	}
	set referralType(value: number) {
		this._referralType = value;
	}
	get referralType(): number {
		return this._referralType;
	}

	get validSteps(): Array<Step> {
		return this.steps.filter(s => !s.isDisabled);
	}

	get navBar(): Array<Step> {
		return this.validSteps.filter(s => !s.isHiddenOnNavBar);
	}

	private get steps(): Array<Step> {
		return [
			{
				key: 'travelingFrom',
				title: this._localeLabels.traveling_from,
				path: 'traveling-from',
				order: 0,
				value: ((): string => {
					if (this._touchedSteps.indexOf(0) === -1) {
						return null;
					}
					if (!(this._travelingFrom && this._travelingFrom.name)) {
						return null;
					}
					return this.travelingFrom.name;
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('travelingFrom'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(0) === -1) {
						return false;
					}
					if (!(this._travelingFrom && this._travelingFrom.name)) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'travelingTo',
				title: this._localeLabels.traveling_to,
				path: 'traveling-to',
				order: 1,
				isDisabled: this._requestType !== RequestType.HavePlan,
				requiredForEstimateCalc: true,
				value: ((): string => {
					if (this._touchedSteps.indexOf(1) === -1) {
						return null;
					}
					if (!this._destination) {
						return null;
					}
					return this.destination.name;
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('travelingTo'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(1) === -1) {
						return false;
					}
					if (!this._destination) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'departureReturn',
				title: this._localeLabels.departure_return,
				path: 'departure-return',
				order: 2,
				requiredForRecommendation: true,
				requiredForEstimateCalc: true,
				value: ((): string => {
					if (this._touchedSteps.indexOf(2) === -1) {
						return null;
					}
					if (!this._departureDate || !this._returnDate) {
						return null;
					}
					const departureMonthString: string =
						this.departureDate.format('M') === this.returnDate.format('M') ? '' : ' / M';
					const departureYearString: string =
						this.departureDate.format('Y') === this.returnDate.format('Y') ? '' : ' / Y';
					return (
						this.departureDate.format(`D${departureMonthString}${departureYearString}`) +
						' - ' +
						this.returnDate.format('D / M / Y')
					);
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('departureReturn'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(2) === -1) {
						return false;
					}
					if (!this._departureDate || !this._returnDate) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'travelers',
				title: this._localeLabels.travelers.title,
				path: 'travelers',
				order: 3,
				requiredForRecommendation: true,
				requiredForEstimateCalc: true,
				value: ((): string => {
					if (this._touchedSteps.indexOf(3) === -1) {
						return null;
					}
					if (!this._adultsNumber) {
						return null;
					}
					return this._localeLabels.travelers.value;
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('travelers'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(3) === -1) {
						return false;
					}
					if (!this._adultsNumber) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'budget',
				title: this._localeLabels.budget,
				path: 'budget',
				order: 4,
				requiredForRecommendation: true,
				requiredForEstimateCalc: true,
				value: ((): string => {
					if (this._touchedSteps.indexOf(4) === -1) {
						return null;
					}
					if (!this.budgetCategory || (this.budgetCategory === 1 && !this._budget)) {
						return null;
					}
					return this.budgetCategory === 1
						? this.currencyPipe.transform(this.budget, 'EGP', `${this._localeLabels.currency.EGP} `, '0.0-0')
						: this.budgetCategoryName;
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('budget'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(4) === -1) {
						return false;
					}
					if (!this.budgetCategory || (this.budgetCategory === 1 && !this._budget)) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'purpose',
				title: this._localeLabels.purpose,
				path: 'purpose',
				order: 5,
				requiredForRecommendation: true,
				value: ((): string => {
					if (this._touchedSteps.indexOf(5) === -1) {
						return null;
					}
					if (!this._purpose) {
						return null;
					}
					return this.purposeName;
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('purpose'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(5) === -1) {
						return false;
					}
					if (!this._purpose) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'preferences',
				title: this._localeLabels.preferences,
				path: 'preferences',
				order: 6,
				requiredForRecommendation: true,
				value: ((): string => {
					if (this._touchedSteps.indexOf(6) === -1) {
						return null;
					}
					return this._preferenceNames.join(', ');
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('preferences'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(6) === -1) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'destinations',
				title: this._localeLabels.destinations,
				path: 'destinations',
				order: 7,
				isDisabled: this._requestType !== RequestType.SurpriseMe,
				requiredForEstimateCalc: true,
				value: ((): string => {
					if (this._touchedSteps.indexOf(7) === -1) {
						return null;
					}
					if (!this._destination) {
						return null;
					}
					return this.destination.name;
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('destinations'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(7) === -1) {
						return false;
					}
					if (!this._destination) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'estimatedCost',
				title: this._localeLabels.estimated_cost,
				path: 'estimated-cost',
				order: 8,
				isDisabled: this.destination && this.destination.id === -1,
				value: ((): string => {
					if (this._touchedSteps.indexOf(8) === -1) {
						return null;
					}
					if (this._estimatedCost == null) {
						return null;
					}
					return this.currencyPipe.transform(this.estimatedCost, 'EGP', `${this._localeLabels.currency.EGP} `, '0.0-0');
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('estimatedCost'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(8) === -1) {
						return false;
					}
					if (!this._estimatedCost) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'travelAssistance',
				title: this._localeLabels.travel_assistance.title,
				path: 'travel-assistance',
				order: 9,
				value: ((): string => {
					if (this._touchedSteps.indexOf(9) === -1) {
						return null;
					}
					const travelAssistanceParams = [];
					if (this.visaAssistanceNeeded) {
						travelAssistanceParams.push(this._localeLabels.travel_assistance.visaAssistance);
					}
					if (this.tourGuideNeeded) {
						travelAssistanceParams.push(this._localeLabels.travel_assistance.tourGuide);
					}
					return travelAssistanceParams.join(', ');
				})(),
				isClickable: (): boolean => this.isNavBarItemClickable('travelAssistance'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(9) === -1) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'information',
				title: this._localeLabels.information.title,
				path: 'information',
				order: 10,
				value: this._localeLabels.information.value,
				isClickable: (): boolean => this.isNavBarItemClickable('information'),
				isValid: (): boolean => {
					if (this._touchedSteps.indexOf(10) === -1) {
						return false;
					}
					if (
						!this._traveler ||
						!this._traveler.name ||
						!this._traveler.mobile ||
						!this._traveler.email ||
						!this._traveler.birthday
					) {
						return false;
					}
					if (!this._referralType) {
						return false;
					}
					return true;
				},
			},
			{
				key: 'ticket',
				title: this._localeLabels.ticket,
				path: 'ticket',
				order: 99,
				value: '',
				isHiddenOnNavBar: true,
				isClickable: (): boolean => this.isNavBarItemClickable('ticket'),
				isValid: (): boolean => true,
			},
		];
	}

	constructor(private currencyPipe: CurrencyPipe, private translate: TranslateService) {
		super();
		translate.get('currency').subscribe(currency => this.setCurrency(currency));
		translate.get('request.nav_bar').subscribe(labels => this.setNavBarLabels(labels));
		translate.get('request.traveling_from.airports').subscribe((airports: Array<TravelingFrom>) => {
			if (airports.length > 0 && !this._travelingFrom) {
				this._travelingFrom = airports[0];
			}
		});
		this._requestType = RequestType.HavePlan;
		this._touchedSteps = [];
		this._preferences = [];
		this._preferenceNames = [];
		this._traveler = {
			name: null,
			mobile: null,
			email: null,
			birthday: null,
		};
	}

	private setCurrency(currency: string): void {
		this._localeLabels.currency = currency;
	}

	private setNavBarLabels(labels: Object): void {
		Object.keys(labels).forEach(key => (this._localeLabels[key] = labels[key]));
	}

	private setAdultsNavBarLabel(label: string): void {
		this._localeLabels.travelers = { ...this._localeLabels.travelers, value: label };
	}

	private resetEstimatedCost(): void {
		this._estimatedCost = null;
	}

	private isNavBarItemClickable(key: string): boolean {
		const currentStepIndex = this.validSteps.findIndex(s => s.key === key);
		return currentStepIndex === 0 || this.validSteps[currentStepIndex - 1].isValid();
	}

	getPureRequest(): any {
		const pureRequest = {};
		Object.keys(this).forEach(key => {
			if (key !== 'currencyPipe' && key !== 'translate' && key !== '_localeLabels' && key !== '_estimatedCost') {
				const setterName = key.replace(/^_/, '');
				const isSetterExists = Request.setters().indexOf(setterName) !== -1;
				pureRequest[isSetterExists ? setterName : key] = this[key];
			}
		});
		pureRequest['date'] = moment();
		return pureRequest;
	}

	setRequestType(requestType: RequestType): void {
		this._requestType = requestType;
	}

	touchStep(value: number) {
		this._touchedSteps.push(value);
	}

	addPreference(preference: Preference): void {
		this._preferences.push(preference.id);
		this._preferenceNames.push(preference.name);
	}

	resetPreference(): void {
		this._preferences = [];
		this._preferenceNames = [];
	}

	isPreferenceSelected(preferenceId: number): boolean {
		return this._preferences.indexOf(preferenceId) !== -1;
	}

	isValidForRecommendedDestinations(): boolean {
		const steps = this.validSteps.filter(s => !s.isHiddenOnNavBar && s.requiredForRecommendation);
		return steps.length === steps.filter(s => s.isValid()).length;
	}

	isValidForEstimatedCost(): boolean {
		const steps = this.validSteps.filter(s => !s.isHiddenOnNavBar && s.requiredForEstimateCalc);
		return steps.length === steps.filter(s => s.isValid()).length;
	}

	isValid(): boolean {
		return this.validSteps.length === this.validSteps.filter(s => s.isValid()).length;
	}
}
