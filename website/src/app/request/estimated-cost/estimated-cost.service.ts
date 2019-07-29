import { Station } from './summary/station.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Country } from '../../shared/models/country.model';
import { RequestService } from '../request.service';
import { TravelingFrom } from '../traveling-from/traveling-from.model';
import { Accommodation, AccommodationRequest, Hotel } from './tab-accommodation/accommodation.model';
import { CityDTO } from './tab-cities/city-dto.model';
import { CitiesRequest } from './tab-cities/city.model';
import { CitySequence, Flight, FlightOffer, FlightRequest } from './tab-flights/flight.model';
import { CityAttractions, AttractionsRequest } from './summary/attraction.model';

@Injectable({ providedIn: 'root' })
export class EstimatedCostService {
	transportationEndPoint = 'package-options/1.0.0/transportationOffers';
	countryCities = 'package-options/1.0.0/countryCities';
	accommodations = 'package-options/1.0.0/accomodationOffers';
	attractionsEndPoint = 'package-options/1.0.0/cityAttractions';

	departureDate = this.requestService.getProperty('departureDate') as Moment;
	returnDate = this.requestService.getProperty('returnDate') as Moment;

	budgetCategory = this.requestService.getProperty('budgetCategory');

	selectedFlightOffers: Array<FlightOffer>;
	selectedCities: Array<CityDTO>;
	selectedHotels: Array<Hotel>;

	isFlightsTabVisited = new Subject<boolean>();

	currentTabIndex = new Subject<number>();

	constructor(private http: HttpClient, private requestService: RequestService) {
		this.isFlightsTabVisited.next(false);
	}

	getDepartureDate(): Moment {
		return this.departureDate;
	}

	getReturnDate(): Moment {
		return this.returnDate;
	}

	getCities(): Observable<Array<CityDTO>> {
		this.setIsLoading(true);
		const citiesRequest: CitiesRequest = { countries: this.getSelectedCountries().map(c => c.ISOCode) };
		return this.http.post<Array<CityDTO>>(`${this.countryCities}/search`, citiesRequest).pipe(
			tap(() => {
				this.setIsLoading(false);
			})
		);
	}

	getNumberOfNights(): number {
		return this.returnDate.diff(this.departureDate, 'days');
	}

	getSelectedCountries(): Array<Country> {
		return this.requestService.getProperty<Array<Country>>('countries');
	}

	setSelectedCities(selectedCities: Array<CityDTO>): void {
		this.selectedCities = selectedCities;
		this.requestService.setProperty('selectedCities', selectedCities);
		this.isFlightsTabVisited.next(false);
	}

	getSelectedCities(): Array<CityDTO> {
		return this.selectedCities;
	}

	setFlightsTabAsVisited(): void {
		this.isFlightsTabVisited.next(true);
	}

	getFlights(): Observable<Array<Flight>> {
		this.setIsLoading(true);
		// const citiesSequence: Array<CitySequence> = [
		// 	{ countryIso: 'KSA', cityIata: 'RUH', numberOfNights: 5 },
		// 	{ countryIso: 'FRA', cityIata: 'PAR', numberOfNights: 6 },
		// ];
		const citiesSequence: Array<CitySequence> = this.getSelectedCities().map(city => ({
			countryIso: city.countryIsoCode,
			cityIata: city.iataCode,
			numberOfNights: city.numberOfNights,
		}));
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			departure: this.departureDate.format('YYYY-MM-DD'),
			citiesSequence: citiesSequence,
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
		};

		return this.http.post<Array<Flight>>(`${this.transportationEndPoint}/search`, flightRequest).pipe(
			map(flights =>
				flights.map(flight => {
					const city = citiesSequence.find(cs => cs.cityIata === flight.origin.iataCode);
					flight.numberOfNights = city ? city.numberOfNights : null;
					return flight;
				})
			),
			tap(() => {
				this.setIsLoading(false);
			})
		);
	}

	setSelectedFlightOffers(flightOffers: Array<FlightOffer>): void {
		this.selectedFlightOffers = flightOffers;
		this.requestService.setProperty('flightOffers', flightOffers);
	}

	setCurrentTabIndex(index) {
		this.currentTabIndex.next(index);
	}

	getAccommodation(): Observable<Array<Accommodation>> {
		this.setIsLoading(true);
		const cities: Array<{ cityIata: string; numberOfNights: number }> = [];
		for (let x = 0; x < this.selectedCities.length; x++) {
			cities.push({ cityIata: this.selectedCities[x].iataCode, numberOfNights: this.selectedCities[x].numberOfNights });
		}
		const accommodationRequest: AccommodationRequest = {
			arrival: this.departureDate.format('YYYY-MM-DD'),
			budgetCategory: /*this.budgetCategory*/ 'SUPER ECONOMY',
			cities: cities,
		};
		return this.http.post<Array<Accommodation>>(`${this.accommodations}/search`, accommodationRequest).pipe(
			tap(() => {
				this.setIsLoading(false);
			})
		);
	}

	setSelectedHotels(selectedHotels) {
		this.selectedHotels = selectedHotels;
	}

	setIsLoading(isLoading: boolean) {
		this.requestService.isLoading.next(isLoading);
	}

	getAttractions(): Observable<Array<CityAttractions>> {
		this.setIsLoading(true);
		const cities: Array<{ cityIata: string; numberOfNights: number }> = [];
		for (let x = 0; x < this.selectedCities.length; x++) {
			cities.push({ cityIata: this.selectedCities[x].iataCode, numberOfNights: this.selectedCities[x].numberOfNights });
		}
		const attractionsRequest: AttractionsRequest = { cities: cities };
		return this.http.post<Array<CityAttractions>>(`${this.attractionsEndPoint}/search`, attractionsRequest).pipe(
			tap(() => {
				this.setIsLoading(false);
			})
		);
	}

	getSelectedFlightOffers(): Array<FlightOffer> {
		return this.selectedFlightOffers;
	}

	getSummaryStations(): Array<Station> {
		this.setIsLoading(true);
		setTimeout(() => { this.setIsLoading(false); }, 2000);
		return [
			{
				name: 'Rome',
				nights_count: 2,
				from: '22-6',
				to: '24-6',
				travel_time: '9:00 am',
				arrive_time: '4:00 pm',
				depart_from: 'Cairo',
				arrive_to: 'Rome',
				duration: '3​h 30​min',
				image: '../../../assets/img/landmark.jpg',
				title: 'Rome - Eternal city',
				description: "Rome’s great gladiatorial arena is the most thrilling of the city's ancient sights. Inaugurated in AD 80, the 50,000, seat Colosseum, also known as the Flavian Amphitheatre, was originally clad in travertine and covered by a huge canvas awning. Inside, tiered seating encircled the arena, itself built over an underground complex where",
				hotel: 'Hotel Raphael & Relais',
				hotel_rate: 4,
				hotel_address: 'Largo Febo 2, Navona, 00186, Rome, Italy',
				activities: [
					{ night: ['Ride & Sail - Bus and Boat 24h hop on hop off', 'Last Minutes Vatican Museums'] },
					{ night: ['Ride & Sail - Bus and Boat 24h hop on hop off', 'Last Minutes Vatican Museums '] }
				],
				next_name: 'Venice'

			},
		];
	}
}
