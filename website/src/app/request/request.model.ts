import { Moment } from 'moment';
import { IRequestNavBar } from './nav-bar/nav-bar.model';

export class Request {
  private _travelingFrom: string;
  private _departureDate: Moment;
  private _returnDate: Moment;
  private _isFlexibleDates: boolean;

  set travelingFrom(value: string) {
    this._travelingFrom = value;
  }
  get travelingFrom(): string {
    return this._travelingFrom;
  }
  set departureDate(value) {
    console.log(value.isValid());
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

  get navBar(): IRequestNavBar {
    return {
      travelingFrom: {
        title: 'Traveling from', path: 'traveling-from', order: 0,
        value: ((): string => {
          if (!this.travelingFrom) { return ''; }
          return this.travelingFrom;
        })()
      },
      departureReturn: {
        title: 'Departure & Return', path: 'departure-return', order: 1,
        value: ((): string => {
          if (!this.departureDate || !this.returnDate) { return ''; }
          return this.departureDate.format('D') + ' - ' + this.returnDate.format('D / M / Y');
        })()
      },
      travelers: {
        title: 'Travelers', path: 'travelers', order: 2,
        value: ((): string => {
          return '';
        })()
      },
      budget: {
        title: 'Budget', path: 'budget', order: 3,
        value: ((): string => {
          return '';
        })()
      },
      purpose: {
        title: 'Purpose', path: 'purpose', order: 4,
        value: ((): string => {
          return '';
        })()
      },
      preferences: {
        title: 'Preferences', path: 'preferences', order: 5,
        value: ((): string => {
          return '';
        })()
      },
      destinations: {
        title: 'Destinations', path: 'destinations', order: 6,
        value: ((): string => {
          return '';
        })()
      },
      estimatedCost: {
        title: 'Estimated Cost', path: 'estimated-cost', order: 7,
        value: ((): string => {
          return '';
        })()
      },
      travelAssistance: {
        title: 'Travel Assistance', path: 'travel-assistance', order: 8,
        value: ((): string => {
          return '';
        })()
      },
      information: {
        title: 'One more step', path: 'information', order: 9,
        value: 'Information'
      }
    };
  }

  isValid(): boolean {
    if (!this.travelingFrom) { return false; }
    if (!this._departureDate.isValid()) { return false; }
    if (!this._returnDate.isValid()) { return false; }
    return true;
  }
}
