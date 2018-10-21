import { CurrencyPipe } from '@angular/common';
import { Moment } from 'moment';
import { Preference } from './preferences/preference.model';
import { Step } from './step.model';

export class Request {
  private _touchedSteps: Array<number>;
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

  set touchedSteps(value: number) {
    this._touchedSteps.push(value);
  }
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
  get preferences(): Array<number> {
    return this._preferences;
  }

  get steps(): Array<Step> {
    return [
      {
        key: 'travelingFrom', title: 'Traveling from', path: 'traveling-from', order: 1,
        value: ((): string => {
          if (!this._travelingFrom) { return null; }
          return this.travelingFrom;
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(1) === -1) { return false; }
          if (!this._travelingFrom) { return false; }
          return true;
        }
      },
      {
        key: 'departureReturn', title: 'Departure & Return', path: 'departure-return', order: 2, requiredForEstimateCalc: true,
        value: ((): string => {
          if (!this._departureDate || !this._returnDate) { return null; }
          return this.departureDate.format('D') + ' - ' + this.returnDate.format('D / M / Y');
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(2) === -1) { return false; }
          if (!this._departureDate || !this._returnDate) { return false; }
          return true;
        }
      },
      {
        key: 'travelers', title: 'Travelers', path: 'travelers', order: 3, requiredForEstimateCalc: true,
        value: ((): string => {
          if (!this._adultsNumber) { return null; }
          return `${this.adultsNumber} adults`;
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(3) === -1) { return false; }
          if (!this._adultsNumber) { return false; }
          return true;
        }
      },
      {
        key: 'budget', title: 'Budget', path: 'budget', order: 4, requiredForEstimateCalc: true,
        value: ((): string => {
          if (!this.budgetCategory || (this.budgetCategory === 1 && !this._budget)) { return null; }
          return this.budgetCategory === 1 ?
            new CurrencyPipe('EN').transform(this.budget, 'EGP', 'code', '0.0-0') : this.budgetCategoryName;
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(4) === -1) { return false; }
          if (!this.budgetCategory || (this.budgetCategory === 1 && !this._budget)) { return false; }
          return true;
        }
      },
      {
        key: 'purpose', title: 'Purpose', path: 'purpose', order: 5,
        value: ((): string => {
          if (!this._purpose) { return null; }
          return this.purposeName;
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(5) === -1) { return false; }
          if (!this._purpose) { return false; }
          return true;
        }
      },
      {
        key: 'preferences', title: 'Preferences', path: 'preferences', order: 6,
        value: ((): string => {
          return this._preferenceNames.join(', ');
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(6) === -1) { return false; }
          return true;
        }
      },
      {
        key: 'destinations', title: 'Destinations', path: 'destinations', order: 7, requiredForEstimateCalc: true,
        value: ((): string => {
          return null;
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(7) === -1) { return false; }
          return true;
        }
      },
      {
        key: 'estimatedCost', title: 'Estimated Cost', path: 'estimated-cost', order: 8,
        value: ((): string => {
          return null;
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(8) === -1) { return false; }
          return true;
        }
      },
      {
        key: 'travelAssistance', title: 'Travel Assistance', path: 'travel-assistance', order: 9,
        value: ((): string => {
          return null;
        })(),
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(9) === -1) { return false; }
          return true;
        }
      },
      {
        key: 'information', title: 'One more step', path: 'information', order: 10,
        value: 'Information',
        isValid: (): boolean => {
          if (this._touchedSteps.indexOf(10) === -1) { return false; }
          return true;
        }
      }
    ];
  }

  constructor() {
    this._touchedSteps = [];
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
    for (let i = 0; i < this.steps.length; ++i) {
      return this.steps[i].isValid();
    }
    return true;
  }

}
