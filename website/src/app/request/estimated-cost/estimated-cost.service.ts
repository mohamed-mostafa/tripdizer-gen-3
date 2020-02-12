import { TravelingFrom } from './../traveling-from/traveling-from.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, Subject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Country } from '../../shared/models/country.model';
import { RequestService } from '../request.service';
import { LUTBudgetCategory } from './../../shared/models/budget-category.model';
import { AttractionsRequest, CityAttractions } from './../summary/attraction.model';
import { Station } from './../summary/station.model';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { Accommodation, AccommodationRequest, Hotel } from './tab-accommodation/accommodation.model';
import { CityDTO } from './tab-cities/city-dto.model';
import { CitiesRequest } from './tab-cities/city.model';
import { CitySequence, FlightOffer, FlightRequest } from './tab-flights/flight-offer.model';

@Injectable({ providedIn: 'root' })
export class EstimatedCostService {
	transportationEndPoint = 'package-options/1.0.0/transportationOffers';
	countryCities = 'package-options/1.0.0/countryCities';
	accommodations = 'package-options/1.0.0/accomodationOffers';
	attractionsEndPoint = 'package-options/1.0.0/cityAttractions';

	isCitiesTabVisited: boolean;
	isFlightsTabVisited: boolean;
	isAccommodationTabVisited: boolean;
	isAccommodationProcessing: boolean;

	notificationTimer: any;
	expirationTimer: any;

	departureDate = this.requestService.getProperty('departureDate') as Moment;
	returnDate = this.requestService.getProperty('returnDate') as Moment;

	budgetCategory = this.requestService.getProperty('budgetCategory');

	travelingFromCoordinates: { lat: number; lng: number } = {} as any;

	cityPaths: any;

	selectedFlightOffers = new Subject<FlightOffer[]>();
	flightOffersSelected: Array<FlightOffer> = [];
	selectedCities = new Subject<CityDTO[]>();
	citiesSelected: Array<CityDTO> = [];
	selectedHotels = new Subject<Hotel[]>();
	hotelsSelected: Array<Hotel> = [];
	summaryStations: Array<Station> = [];
	cityAttractionsList: Array<CityAttractions> = [];

	currentTabIndex = new Subject<number>();
	finishGetAttractions = new Subject<boolean>();

	cachedTabsData: {
		cities?: Array<CityDTO>;
		flightOffers?: Array<FlightOffer>;
		accommodation?: Array<Accommodation>;
	};

	constructor(
		private http: HttpClient,
		private router: Router,
		private dialog: MatDialog,
		private requestService: RequestService,
		public translate: TranslateService
	) {
		this.setCurrentTabIndex(0);
		this.cachedTabsData = this.requestService.getProperty('cachedTabsData') || {};
		this.translate.get('request.traveling_from.airports').subscribe(airports => {
			Object.keys(airports).forEach(k => {
				if (airports[k].en_name === this.requestService.getProperty('travelingFrom').name) {
					const cityLocation = { lat: Number(airports[k].lat), lng: Number(airports[k].lng) };
					this.travelingFromCoordinates = cityLocation;
				}
			});
		});

		this.selectedCities.subscribe(citiesSelected => {
			this.citiesSelected = citiesSelected;
			this.requestService.setProperty('selectedCities', citiesSelected);
		});

		this.selectedFlightOffers.subscribe(flightOffersSelected => {
			this.flightOffersSelected = flightOffersSelected;
			this.requestService.setProperty('flightOffers', flightOffersSelected);
		});

		this.selectedHotels.subscribe(hotelsSelected => {
			this.hotelsSelected = hotelsSelected;
			this.requestService.setProperty('selectedHotels', hotelsSelected);
		});
		this.requestService.endSessionTimerSubject.subscribe(() => {
			this.endSessionTimer();
		});
		this.requestService.clearEstimatedCostData.subscribe(() => {
			this.cachedTabsData = { cities: [], flightOffers: [], accommodation: [] };
		});
	}

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

	setCityPaths(paths) {
		this.cityPaths = paths;
	}

	getCityPaths() {
		return this.cityPaths;
	}

	endSessionTimer(): void {
		clearTimeout(this.notificationTimer);
		clearTimeout(this.expirationTimer);
	}

	getDepartureDate(): Moment {
		return this.departureDate;
	}

	getReturnDate(): Moment {
		return this.returnDate;
	}

	getCities(): Observable<Array<CityDTO>> {
		// if (this.cachedTabsData.cities && this.cachedTabsData.cities.length) {
		// 	return of(this.cachedTabsData.cities);
		// } else {
		this.requestService.isLoading.next({
			show: true,
			message: this.translate.instant('request.estimated_cost.loading_messages.cities_tab_message'),
		});
		const citiesRequest: CitiesRequest = { countries: this.getSelectedCountries().map(c => c.ISOCode) };
		return this.http.post<Array<CityDTO>>(`${this.countryCities}/search`, citiesRequest).pipe(
			tap(returnedCities => {
				this.setIsLoading(false, '');
				this.requestService.isLoading.next({ show: false, message: '' });
				this.updateCitiesInCache(returnedCities);
			})
		);
		// }
	}

	updateCitiesInCache(cities) {
		this.cachedTabsData.cities = cities;
	}

	getNumberOfNights(): number {
		this.departureDate = this.requestService.getProperty('departureDate') as Moment;
		this.returnDate = this.requestService.getProperty('returnDate') as Moment;
		return this.returnDate.diff(this.departureDate, 'days');
	}

	getSelectedCountries(): Array<Country> {
		return this.requestService.getProperty<Array<Country>>('countries');
	}

	setSelectedCities(selectedCities: Array<CityDTO>): void {
		this.selectedCities.next(selectedCities);
	}

	getSelectedCities(): Array<CityDTO> {
		return this.citiesSelected;
	}

	getFlightOffers(): Observable<Array<FlightOffer>> {
		// if (this.cachedTabsData.flightOffers && this.cachedTabsData.flightOffers.length) {
		// 	return of(this.cachedTabsData.flightOffers);
		// } else {
		if (this.isFlightsTabVisited) {
			this.setIsLoading(true, this.translate.instant('request.estimated_cost.loading_messages.flights_tab_message'));
		}

		const citiesSequence: Array<CitySequence> = this.getSelectedCities().map(city => ({
			countryIso: city.countryIsoCode,
			cityIata: city.iataCode,
			numberOfNights: city.numberOfNights,
		}));
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			departure: this.departureDate.locale('en').format('YYYY-MM-DD'),
			citiesSequence,
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
		};

		return this.http.post<Array<FlightOffer>>(`${this.transportationEndPoint}/search`, flightRequest).pipe(
			tap(returnedFlightOffers => {
				if (this.isFlightsTabVisited) {
					this.setIsLoading(false, '');
				}
				this.startSessionTimer();
				this.updateFlightsOffersInCache(returnedFlightOffers);
			}),
			catchError((err: any, caught: Observable<any>) => {
				if (this.isFlightsTabVisited) {
					this.setIsLoading(false, '');
				}
				return err;
			})
		);
		// }
	}

	updateFlightsOffersInCache(flightsOffers) {
		this.cachedTabsData.flightOffers = flightsOffers;
	}

	setSelectedFlightOffers(flightOffers: Array<FlightOffer>): void {
		this.selectedFlightOffers.next(flightOffers);
	}

	getFlightsTotalCost(): number {
		return Object.keys(this.flightOffersSelected).reduce((pv, cv) => pv + +this.flightOffersSelected[cv].price, 0);
	}

	setCurrentTabIndex(index) {
		this.currentTabIndex.next(index);

		if (index === 2 && this.isAccommodationProcessing) {
			this.accommodationLoading();
		}
	}

	getAccommodation(): Observable<Array<Accommodation>> {
		this.isAccommodationProcessing = true;
		const cities: Array<{ cityName: string; numberOfNights: number; cityIata: string; countryName: string }> = [];
		for (const sc of this.citiesSelected) {
			cities.push({
				cityName: sc.name,
				countryName: sc.countryDisplayName,
				cityIata: sc.iataCode,
				numberOfNights: sc.numberOfNights,
			});
		}

		this.budgetCategory = this.requestService.getProperty('budgetCategory');
		let accommodationDesiredCostPerPerson = 0;
		if (this.budgetCategory === LUTBudgetCategory.OwnBudget) {
			const flightCost = this.getFlightsTotalCost();
			const numberOfPayingCustomers =
				this.requestService.getProperty('adultsNumber') + this.requestService.getProperty('kidsNumber');
			const flightCostPerPerson = Math.ceil(flightCost / numberOfPayingCustomers);
			const totalDesiredCostPerPerson = this.requestService.getProperty('budget');
			accommodationDesiredCostPerPerson = totalDesiredCostPerPerson - flightCostPerPerson;
		}
		const accommodationRequest: AccommodationRequest = {
			arrival: this.departureDate.locale('en').format('YYYY-MM-DD'),
			budgetCategory: this.budgetCategory.toString(), // 'SUPER ECONOMY',
			cities,
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
			desiredCostPerPerson: accommodationDesiredCostPerPerson,
		};
		return this.http.post<Array<Accommodation>>(`${this.accommodations}/search`, accommodationRequest).pipe(
			tap(returnedAccommodation => {
				if (this.isAccommodationTabVisited) {
					this.setIsLoading(false, '');
				}
				this.updateAccommodationInCache(returnedAccommodation);
			}),
			catchError((err: any, caught: Observable<any>) => {
				this.setIsLoading(false, '');
				return err;
			})
		);
		// }
	}

	updateAccommodationInCache(accommodation) {
		this.cachedTabsData.accommodation = accommodation;
	}

	setSelectedHotels(selectedHotels) {
		this.selectedHotels.next(selectedHotels);
	}

	getSelectedHotels() {
		return this.hotelsSelected;
	}

	getHotelsTotalCost() {
		let totalCost = 0;
		for (const sh of this.hotelsSelected) {
			totalCost = sh.price + totalCost;
		}
		return totalCost;
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

	getAttractions(): Observable<Array<CityAttractions>> {
		this.setIsLoading(true, '');
		const cities: Array<{ cityIata: string; numberOfNights: number }> = [];
		for (const selectedCity of this.citiesSelected) {
			cities.push({ cityIata: selectedCity.iataCode, numberOfNights: selectedCity.numberOfNights });
		}
		const attractionsRequest: AttractionsRequest = { cities };
		return this.http.post<Array<CityAttractions>>(`${this.attractionsEndPoint}/search`, attractionsRequest).pipe(
			tap(() => {
				this.setIsLoading(false, '');
				this.finishGetAttractions.next(true);
			})
		);
	}

	getSelectedFlightOffers(): Array<FlightOffer> {
		return this.flightOffersSelected;
	}

	getSummaryStations(): Array<Station> {
		this.getAttractions().subscribe(cityAttractionsList => {
			this.cityAttractionsList = cityAttractionsList; // keep the attractions we received from the backend
			this.requestService.setProperty('selectedAttractions', cityAttractionsList);

			const selectedFlightOffers: Array<FlightOffer> = this.getSelectedFlightOffers();
			const selectedCities: Array<CityDTO> = this.getSelectedCities();
			const selectedHotels: Array<Hotel> = this.getSelectedHotels();

			// then construct the corresponding 'stations' objects
			this.summaryStations.splice(0, this.summaryStations.length);
			const tripStartDate = moment(this.requestService.getProperty('departureDate'));

			cityAttractionsList.forEach(cityAttraction => {
				const stationCity: CityDTO = selectedCities.find(cityDTO => cityDTO.iataCode === cityAttraction.city.iataCode);
				var stationFlightLeg = null;
				selectedFlightOffers.forEach(flightOffer => {
					stationFlightLeg = flightOffer.flightLegs.find(
						flightLeg =>
							flightLeg.destination.iataCode === cityAttraction.city.iataCode.substring(0, 3) &&
							this.summaryStations.find(
								summaryStation => summaryStation.arrive_code == flightLeg.destination.iataCode
							) == null
					);
				});
				const stationHotel = selectedHotels.find(hotel => hotel.city === cityAttraction.city.name);

				if (stationCity) {
					const station: Station = {
						// city
						image: stationCity.thumbnail,
						name: stationCity.displayName,
						title: stationCity.displayName,
						description: stationCity.description,
						nights_count: stationCity.numberOfNights,
						// dates
						from: moment(tripStartDate).format('DD/MM'),
						to: moment(tripStartDate)
							// tslint:disable-next-line: deprecation
							.add('days', stationCity.numberOfNights)
							.format('DD/MM'),

						// flights
						flightDataExists: stationFlightLeg ? true : false,
						depart_from: stationFlightLeg ? stationFlightLeg.segments[0].originDetails : 'origin',
						arrive_to: stationFlightLeg
							? stationFlightLeg.segments[stationFlightLeg.segments.length - 1].destinationDetails
							: 'destination',
						duration: stationFlightLeg ? stationFlightLeg.totalDurationInWords : 'Unknown',
						travel_time: stationFlightLeg
							? moment(stationFlightLeg.segments[0].departure).format('DD/MM HH:mm')
							: 'Unknown time',
						arrive_time: stationFlightLeg
							? moment(stationFlightLeg.segments[stationFlightLeg.segments.length - 1].arrival).format('DD/MM HH:mm')
							: 'unknown time',
						carrier_logo: stationFlightLeg ? stationFlightLeg.segments[0].carrier.squareLogo : null,
						depart_hour: stationFlightLeg
							? moment(stationFlightLeg.segments[0].departure).format('HH:mm')
							: 'Unknown time',
						arrive_hour: stationFlightLeg
							? moment(stationFlightLeg.segments[stationFlightLeg.segments.length - 1].arrival).format('HH:mm')
							: 'unknown time',
						arrive_code: stationFlightLeg ? stationFlightLeg.destination.iataCode : '',
						depart_code: stationFlightLeg ? stationFlightLeg.origin.iataCode : '',

						// accommodation
						accommodationDataExists: stationHotel ? true : false,
						hotel: stationHotel ? stationHotel.name : 'None Selected',
						hotel_rate: stationHotel ? stationHotel.stars : 0,
						hotel_address: stationHotel ? stationHotel.address : 'No Hotel Selected',
						accommodation_from: stationFlightLeg
							? moment(stationFlightLeg.segments[0].departure).format('DD MMM YYYY')
							: 'Unknown time',
						accommodation_to: moment(tripStartDate)
							// tslint:disable-next-line: deprecation
							.add('days', stationCity.numberOfNights)
							.format('DD MMM YYYY'),

						// activities
						activities: cityAttraction.attractions.map(attraction => ({
							night: [attraction.category],
						})),

						isReturnStation: false,
					};

					this.summaryStations.push(station);
				}
				// jump to next date
				// tslint:disable-next-line: deprecation
				tripStartDate.add('days', stationCity.numberOfNights);
			});

			// add an extra station, which is the origin step (e.g. return to cairo)
			if (this.summaryStations.length > 0) {
				const lastStationAirport = this.requestService.getProperty('travelingFrom');
				let lastStationFlightLeg = null;
				selectedFlightOffers.forEach(flightOffer => {
					lastStationFlightLeg = flightOffer.flightLegs.find(
						flightLeg => flightLeg.destination.iataCode === lastStationAirport.iataCode
					);
				});

				const lastStation: Station = {
					// city
					image: '',
					name: lastStationAirport.name,
					title: lastStationAirport.name,
					description: '',
					nights_count: 0,

					// flights
					flightDataExists: lastStationFlightLeg ? true : false,
					depart_from: lastStationFlightLeg ? lastStationFlightLeg.segments[0].originDetails : 'origin',
					arrive_to: lastStationFlightLeg
						? lastStationFlightLeg.segments[lastStationFlightLeg.segments.length - 1].destinationDetails
						: 'destination',
					duration: lastStationFlightLeg ? lastStationFlightLeg.totalDurationInWords : 'Unknown',
					travel_time: lastStationFlightLeg
						? moment(lastStationFlightLeg.segments[0].departure).format('DD/MM HH:mm')
						: 'Unknown time',
					arrive_time: lastStationFlightLeg
						? moment(lastStationFlightLeg.segments[lastStationFlightLeg.segments.length - 1].arrival).format(
								'DD/MM HH:mm'
								// tslint:disable-next-line: indent
						  )
						: 'unknown time',
					carrier_logo: lastStationFlightLeg ? lastStationFlightLeg.segments[0].carrier.squareLogo : null,

					// dates
					from: lastStationFlightLeg
						? moment(lastStationFlightLeg.segments[lastStationFlightLeg.segments.length - 1].arrival).format('DD/MM')
						: '',
					to: null,

					depart_hour: lastStationFlightLeg
						? moment(lastStationFlightLeg.segments[0].departure).format('HH:mm')
						: 'Unknown time',
					arrive_hour: lastStationFlightLeg
						? moment(lastStationFlightLeg.segments[lastStationFlightLeg.segments.length - 1].arrival).format(
								'HH:mm'
								// tslint:disable-next-line: indent
						  )
						: 'unknown time',

					arrive_code: lastStationFlightLeg ? lastStationFlightLeg.destination.iataCode : null,
					depart_code: lastStationFlightLeg ? lastStationFlightLeg.origin.iataCode : null,

					// accommodation
					accommodationDataExists: false,
					hotel: '',
					hotel_rate: 0,
					hotel_address: '',

					// activities
					activities: [],

					isReturnStation: true,
				};
				this.summaryStations.push(lastStation);
			}
		});
		return this.summaryStations;
	}

	public get summaryTotalCost() {
		return {
			hotels: this.getHotelsTotalCost(),
			flights: this.getFlightsTotalCost(),
		};
	}

	openSessionDialog(minutes): void {
		this.dialog.open(SessionDialogComponent, { autoFocus: true, maxWidth: 600, data: { minutes } });
	}
}
