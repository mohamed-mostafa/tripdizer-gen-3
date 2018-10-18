import { CurrencyPipe } from '@angular/common';
import { Moment } from 'moment';
import { IRequestNavBar } from './nav-bar/nav-bar.model';
import { Preference } from './preferences/Preference.model';

export class Request {
  private _travelingFrom: string;
  private _departureDate: Moment;
  private _returnDate: Moment;
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

  set travelingFrom(value: string) {
    this._travelingFrom = value;
  }
  get travelingFrom(): string {
    return this._travelingFrom;
  }
  set departureDate(value: Moment) {
    this._departureDate = value;
  }
  get departureDate(): Moment {
    return this._departureDate;
  }
  set returnDate(value: Moment) {
    this._returnDate = value;
  }
  get returnDate(): Moment {
    return this._returnDate;
  }
  set isFlexibleDates(value: boolean) {
    this._isFlexibleDates = value;
  }
  get isFlexibleDates(): boolean {
    return this._isFlexibleDates;
  }
  set adultsNumber(value) {
    this._adultsNumber = parseInt(value.toString(), 10);
  }
  get adultsNumber(): number {
    return this._adultsNumber;
  }
  set kidsNumber(value) {
    this._kidsNumber = parseInt(value.toString(), 10);
  }
  get kidsNumber(): number {
    return this._kidsNumber || 0;
  }
  set infantsNumber(value) {
    this._infantsNumber = parseInt(value.toString(), 10);
  }
  get infantsNumber(): number {
    return this._infantsNumber || 0;
  }
  set budget(value) {
    this._budget = parseInt(value.toString(), 10);
  }
  get budget(): number {
    return this.budgetCategory === 1 ? this._budget || 1 : 1;
  }
  set budgetCategory(value) {
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

  get navBar(): IRequestNavBar {
    return {
      travelingFrom: {
        title: 'Traveling from', path: 'traveling-from', order: 0,
        value: ((): string => {
          if (!this._travelingFrom) { return null; }
          return this.travelingFrom;
        })()
      },
      departureReturn: {
        title: 'Departure & Return', path: 'departure-return', order: 1,
        value: ((): string => {
          if (!this._departureDate || !this._returnDate) { return null; }
          return this.departureDate.format('D') + ' - ' + this.returnDate.format('D / M / Y');
        })()
      },
      travelers: {
        title: 'Travelers', path: 'travelers', order: 2,
        value: ((): string => {
          if (!this._adultsNumber) { return null; }
          return `${this.adultsNumber} adults`;
        })()
      },
      budget: {
        title: 'Budget', path: 'budget', order: 3,
        value: ((): string => {
          if (!this.budgetCategory || (this.budgetCategory === 1 && !this._budget)) { return null; }
          return this.budgetCategory === 1 ? new CurrencyPipe('EN').transform(this.budget, 'EGP', true, '0.0-0') : this.budgetCategoryName;
        })()
      },
      purpose: {
        title: 'Purpose', path: 'purpose', order: 4,
        value: ((): string => {
          if (!this._purpose) { return null; }
          return this.purposeName;
        })()
      },
      preferences: {
        title: 'Preferences', path: 'preferences', order: 5,
        value: ((): string => {
          return this._preferenceNames.join(', ');
        })()
      },
      destinations: {
        title: 'Destinations', path: 'destinations', order: 6,
        value: ((): string => {
          return null;
        })()
      },
      estimatedCost: {
        title: 'Estimated Cost', path: 'estimated-cost', order: 7,
        value: ((): string => {
          return null;
        })()
      },
      travelAssistance: {
        title: 'Travel Assistance', path: 'travel-assistance', order: 8,
        value: ((): string => {
          return null;
        })()
      },
      information: {
        title: 'One more step', path: 'information', order: 9,
        value: 'Information'
      }
    };
  }

  constructor() {
    this._preferences = [];
    this._preferenceNames = [];
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

  isValid(): boolean {
    if (!this._travelingFrom) { return false; }
    if (!this._departureDate.isValid()) { return false; }
    if (!this._returnDate.isValid()) { return false; }
    if (!this._adultsNumber) { return false; }
    if (!this.budgetCategory || (this.budgetCategory === 1 && !this._budget)) { return false; }
    return true;
  }
}
