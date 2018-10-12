import { IRequestNavBar } from './nav-bar/nav-bar.model';

export class Request {
  get navBar(): IRequestNavBar {
    return {
      travelingFrom: { title: 'Traveling from', value: '', path: 'traveling-from', order: 0 },
      departureReturn: { title: 'Departure & Return', value: '', path: 'departure-return', order: 1 },
      travelers: { title: 'Travelers', value: '', path: 'travelers', order: 2 },
      budget: { title: 'Budget', value: '', path: 'budget', order: 3 },
      purpose: { title: 'Purpose', value: '', path: 'purpose', order: 4 },
      preferences: { title: 'Preferences', value: '', path: 'preferences', order: 5 },
      destinations: { title: 'Destinations', value: '', path: 'destinations', order: 6 },
      estimatedCost: { title: 'Estimated Cost', value: '', path: 'estimated-cost', order: 7 },
      travelAssistance: { title: 'Travel Assistance', value: '', path: 'travel-assistance', order: 8 },
      information: { title: 'One more step', value: 'Information', path: 'information', order: 9 }
    };
  }
}
