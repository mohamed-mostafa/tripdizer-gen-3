import { TravelingFrom } from './../traveling-from/traveling-from.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { Observable, Subject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Country } from '../../shared/models/country.model';
import { RequestService } from '../request.service';
import { LUTBudgetCategory } from './../../shared/models/budget-category.model';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { Accommodation, AccommodationRequest } from './tab-accommodation/accommodation.model';
import { CityDTO } from './tab-cities/city-dto.model';
import { CitiesRequest } from './tab-cities/city.model';
import { CitySequence, FlightOffer, FlightRequest } from './tab-flights/flight-offer.model';

@Injectable({ providedIn: 'root' })
export class EstimatedCostService {
	transportationEndPoint = 'package-options/1.0.0/transportationOffers';
	countryCities = 'package-options/1.0.0/countryCities';
	accommodations = 'package-options/1.0.0/accomodationOffers';

	isFlightsTabVisited: boolean;
	isAccommodationTabVisited: boolean;
	isAccommodationProcessing: boolean;

	notificationTimer: any;
	expirationTimer: any;

	travelingFromCoordinates: { lat: number; lng: number } = {} as any;
	cityPaths: any;

	citiesFlightsAccommodations: {
		cities: Array<CityDTO>;
		flightOffers: Array<FlightOffer>;
		accommodationOffers: Array<Accommodation>;
	};

	currentTabIndex = new Subject<number>();

	constructor(
		private http: HttpClient,
		private router: Router,
		private dialog: MatDialog,
		private requestService: RequestService,
		public translate: TranslateService
	) {
		this.citiesFlightsAccommodations = { cities: [], flightOffers: [], accommodationOffers: [] };
		console.log(this.citiesFlightsAccommodations);
		this.setCurrentTabIndex(0);
		this.getTravelingFromCoordinates();
		this.requestService.endSessionTimerSubject.subscribe(() => {
			this.endSessionTimer();
		});
	}

	getFlightsTotalCost(): number {
		const selectedFlightOffers = this.citiesFlightsAccommodations.flightOffers.filter(offer => offer.selected);
		return Object.keys(selectedFlightOffers).reduce((pv, cv) => pv + +selectedFlightOffers[cv].price, 0);
	}

	setIsLoading(isLoading: boolean, message: string) {
		this.requestService.isLoading.next({ show: isLoading, message });
	}

	flightsLoading(): void {
		this.setIsLoading(true, this.translate.instant('request.estimated_cost.loading_messages.flights_tab_message'));
	}

	accommodationLoading(): void {
		this.setIsLoading(
			true,
			this.translate.instant('request.estimated_cost.loading_messages.accommodation_tab_message')
		);
	}

	/* cities logic */

	getCities(): Observable<Array<CityDTO>> {
		this.citiesFlightsAccommodations = this.requestService.getProperty('citiesFlightsAccommodations') || {
			cities: [],
			flightOffers: [],
			accommodationOffers: [],
		};
		console.log(this.citiesFlightsAccommodations);
		if (this.citiesFlightsAccommodations && this.citiesFlightsAccommodations.cities.length > 0) {
			return of(this.citiesFlightsAccommodations.cities);
		} else {
			this.requestService.isLoading.next({
				show: true,
				message: this.translate.instant('request.estimated_cost.loading_messages.cities_tab_message'),
			});
			const citiesRequest: CitiesRequest = { countries: this.getSelectedCountries().map(c => c.ISOCode) };
			return this.http.post<Array<CityDTO>>(`${this.countryCities}/search`, citiesRequest).pipe(
				map(citiesResponse => {
					return citiesResponse.map((city, i) => ({ ...city, selected: i < this.getMaxNumberOfCities() }));
				}),
				tap(citiesResponse => {
					this.setIsLoading(false, '');
					this.requestService.isLoading.next({ show: false, message: '' });
					this.setCities(citiesResponse);
				}),
				catchError((err: any, caught: Observable<any>) => {
					return err;
				})
			);
		}
	}

	setCities(cities: Array<CityDTO>): void {
		console.log(this.citiesFlightsAccommodations);
		if (this.citiesFlightsAccommodations) {
			this.citiesFlightsAccommodations.cities = cities;
			this.citiesFlightsAccommodations.flightOffers = this.citiesFlightsAccommodations.accommodationOffers = [];
			this.requestService.setProperty('citiesFlightsAccommodations', this.citiesFlightsAccommodations);
		}
	}

	getNumberOfNights(): number {
		return this.getReturnDate().diff(this.getDepartureDate(), 'days');
	}

	getMaxNumberOfCities(): number {
		return Math.ceil(this.getNumberOfNights() / 1);
	}

	getCitiesWithNights(): Array<CityDTO> {
		const cities = this.citiesFlightsAccommodations.cities;
		if (cities.length > 0) {
			const selectedCities = cities.filter(c => c.selected);
			const numberOfNights = this.getNumberOfNights();
			const floorDivision = Math.floor(numberOfNights / selectedCities.length);
			const modulus = numberOfNights % selectedCities.length;
			return selectedCities.map((city: CityDTO, index) => ({
				...city,
				numberOfNights: index === 0 ? floorDivision + modulus : floorDivision,
			}));
		}
	}

	setCityPaths(paths) {
		this.cityPaths = paths;
	}

	/* flightOffers logic */

	getFlightOffers(): Observable<Array<FlightOffer>> {
		this.citiesFlightsAccommodations = this.requestService.getProperty('citiesFlightsAccommodations');
		if (this.citiesFlightsAccommodations.flightOffers && this.citiesFlightsAccommodations.flightOffers.length > 0) {
			return of(this.citiesFlightsAccommodations.flightOffers);
		} else {
			this.requestService.isLoading.next({
				show: true,
				message: this.translate.instant('request.estimated_cost.loading_messages.flights_tab_message'),
			});

			const citiesSequence: Array<CitySequence> = this.getCitiesWithNights().map(city => ({
				countryIso: city.countryIsoCode,
				cityIata: city.iataCode,
				numberOfNights: city.numberOfNights,
			}));

			const flightOffersRequest: FlightRequest = {
				origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
				departure: this.getDepartureDate()
					.locale('en')
					.format('YYYY-MM-DD'),
				citiesSequence,
				numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
				numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
				numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
			};

			return this.http.post<Array<FlightOffer>>(`${this.transportationEndPoint}/search`, flightOffersRequest).pipe(
				map(flightResponse => {
					return flightResponse.map((flightOffer, i) => ({ ...flightOffer, selected: i === 0 }));
				}),
				tap(flightOffersResponse => {
					this.setIsLoading(false, '');
					this.requestService.isLoading.next({ show: false, message: '' });
					this.startSessionTimer();
					this.setFlightOffers(flightOffersResponse);
				}),
				catchError((err: any, caught: Observable<any>) => {
					return err;
				})
			);
		}
	}

	getCityPaths() {
		return this.cityPaths;
	}

	setFlightOffers(flightOffers: Array<FlightOffer>): void {
		this.citiesFlightsAccommodations.flightOffers = flightOffers;
		this.requestService.setProperty('citiesFlightsAccommodations', this.citiesFlightsAccommodations);
	}

	/* accommodationOffers logic */

	getAccommodationOffers(): Observable<Array<Accommodation>> {
		this.citiesFlightsAccommodations = this.requestService.getProperty('citiesFlightsAccommodations');
		if (
			this.citiesFlightsAccommodations.accommodationOffers &&
			this.citiesFlightsAccommodations.accommodationOffers.length > 0
		) {
			return of(this.citiesFlightsAccommodations.accommodationOffers);
		} else {
			this.requestService.isLoading.next({
				show: true,
				message: this.translate.instant('request.estimated_cost.loading_messages.accommodation_tab_message'),
			});

			const cities: Array<{ cityName: string; numberOfNights: number; cityIata: string; countryName: string }> = [];
			for (const cityWithNights of this.getCitiesWithNights()) {
				cities.push({
					cityName: cityWithNights.name,
					countryName: cityWithNights.countryDisplayName,
					cityIata: cityWithNights.iataCode,
					numberOfNights: cityWithNights.numberOfNights,
				});
			}

			let accommodationDesiredCostPerPerson = 0;
			if (this.getBudgetCategory() === LUTBudgetCategory.OwnBudget) {
				const flightCost = this.getFlightsTotalCost();
				const numberOfPayingCustomers =
					this.requestService.getProperty('adultsNumber') + this.requestService.getProperty('kidsNumber');
				const flightCostPerPerson = Math.ceil(flightCost / numberOfPayingCustomers);
				const totalDesiredCostPerPerson = this.requestService.getProperty('budget');
				accommodationDesiredCostPerPerson = totalDesiredCostPerPerson - flightCostPerPerson;
			}

			const accommodationRequest: AccommodationRequest = {
				arrival: this.getDepartureDate()
					.locale('en')
					.format('YYYY-MM-DD'),
				budgetCategory: this.getBudgetCategory().toString(),
				cities,
				numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
				numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
				numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
				desiredCostPerPerson: accommodationDesiredCostPerPerson,
			};

			return this.http.post<Array<Accommodation>>(`${this.accommodations}/search`, accommodationRequest).pipe(
				map(accommodationOffersResponse => {
					return accommodationOffersResponse.map(offer => ({
						city: offer.city,
						hotels: offer.hotels.map((hotel, i) => ({ ...hotel, selected: i === 0 })),
					}));
				}),
				tap(accommodationOffersResponse => {
					this.setIsLoading(false, '');
					this.requestService.isLoading.next({ show: false, message: '' });
					this.setAccommodationOffers(accommodationOffersResponse);
				}),
				catchError((err: any, caught: Observable<any>) => {
					return err;
				})
			);
		}
	}

	setAccommodationOffers(accommodationOffers: Array<Accommodation>): void {
		this.citiesFlightsAccommodations.accommodationOffers = accommodationOffers;
		this.requestService.setProperty('citiesFlightsAccommodations', this.citiesFlightsAccommodations);
	}

	/* Session management logic */
	startSessionTimer(): void {
		const expirationInMinutes = environment.requestSessionExpiration;
		const notificationRatio = 1 - 2 / 15;
		this.endSessionTimer();
		this.notificationTimer = setTimeout(() => {
			clearTimeout(this.notificationTimer);
			this.openSessionDialog(expirationInMinutes * (1 - notificationRatio));
		}, expirationInMinutes * 60 * 1000 * notificationRatio);
		this.expirationTimer = setTimeout(() => {
			clearTimeout(this.expirationTimer);
			this.openSessionDialog(0);
			this.router.navigate(['request']).then(() => {
				this.router.navigate(['request', 'estimated-cost']);
			});
		}, expirationInMinutes * 60 * 1000);
	}

	endSessionTimer(): void {
		clearTimeout(this.notificationTimer);
		clearTimeout(this.expirationTimer);
	}

	openSessionDialog(minutes): void {
		this.dialog.open(SessionDialogComponent, { autoFocus: true, maxWidth: 600, data: { minutes } });
	}

	/* other logic */
	getTravelingFromCoordinates() {
		this.translate.get('request.traveling_from.airports').subscribe(airports => {
			Object.keys(airports).forEach(k => {
				if (airports[k].en_name === this.requestService.getProperty('travelingFrom').name) {
					const cityLocation = { lat: Number(airports[k].lat), lng: Number(airports[k].lng) };
					this.travelingFromCoordinates = cityLocation;
				}
			});
		});
	}

	getDepartureDate(): Moment {
		return this.requestService.getProperty('departureDate') as Moment;
	}

	getReturnDate(): Moment {
		return this.requestService.getProperty('returnDate') as Moment;
	}

	getBudgetCategory() {
		return this.requestService.getProperty('budgetCategory');
	}

	getSelectedCountries() {
		return this.requestService.getProperty<Array<Country>>('countries');
	}

	setCurrentTabIndex(index) {
		this.currentTabIndex.next(index);

		if (index === 2 && this.isAccommodationProcessing) {
			this.accommodationLoading();
		}
	}

	/* navigation logic */
	tabsNavigate(source, action, routeConfigPath?, route?) {
		console.log(this.citiesFlightsAccommodations);
		// console.log(this.citiesFlightsAccommodations.cities);
		if (source === 'cities' && action === 'back') {
			this.stepNavigate(routeConfigPath, route, 'back');
		} else if (source === 'cities' && action === 'next') {
			if (
				this.citiesFlightsAccommodations &&
				this.citiesFlightsAccommodations.cities &&
				this.citiesFlightsAccommodations.cities.length
			) {
				this.currentTabIndex.next(1);
			}
		} else if (source === 'flights' && action === 'back') {
			this.currentTabIndex.next(0);
		} else if (source === 'flights' && action === 'next') {
			if (
				this.citiesFlightsAccommodations &&
				this.citiesFlightsAccommodations.cities &&
				this.citiesFlightsAccommodations.cities.length
			) {
				this.currentTabIndex.next(2);
			}
		} else if (source === 'accommodation' && action === 'back') {
			this.currentTabIndex.next(1);
		} else if (source === 'accommodation' && action === 'next') {
			this.stepNavigate(routeConfigPath, route, 'next');
		} else if (source === 'summary' && action === 'back') {
			this.stepNavigate(routeConfigPath, route, 'back');
			setTimeout(() => this.setCurrentTabIndex(2), 0);
		} else if (source === 'summary' && action === 'modify') {
			this.stepNavigate(routeConfigPath, route, 'back');
		} else if (source === 'summary' && action === 'next') {
			this.stepNavigate(routeConfigPath, route, 'next');
		}
	}

	stepNavigate(routeConfigPath, route, direction) {
		if (direction === 'next') {
			this.router.navigate(['../', this.requestService.getNextStep(routeConfigPath)], {
				relativeTo: route,
			});
		} else if (direction === 'back') {
			this.router.navigate(['../', this.requestService.getPrevStep(routeConfigPath)], {
				relativeTo: route,
			});
		}
	}
}
