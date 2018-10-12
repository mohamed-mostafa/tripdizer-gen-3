export interface IRequestNavBar {
  travelingFrom: INavLink;
  departureReturn: INavLink;
  travelers: INavLink;
  budget: INavLink;
  purpose: INavLink;
  preferences: INavLink;
  destinations: INavLink;
  estimatedCost: INavLink;
  travelAssistance: INavLink;
  information: INavLink;
}

export interface INavLink {
  title: string;
  value: string;
  path: string;
  order: number;
}
