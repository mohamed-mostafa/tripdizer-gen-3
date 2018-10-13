import { IRequestNavBar } from './nav-bar/nav-bar.model';

export class Request {
  private _travelingFrom: string;

  set travelingFrom(value: string) {
    this._travelingFrom = value;
  }
  get travelingFrom() {
    return this._travelingFrom;
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
          return '';
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
    return true;
  }
}
