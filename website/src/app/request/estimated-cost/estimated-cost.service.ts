import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Country } from 'src/app/shared/models/country.model';
import { RequestService } from '../request.service';
import { TravelingFrom } from '../traveling-from/traveling-from.model';
import { Accommodation, AccommodationRequest } from './tab-accommodation/accommodation.model';
import { CityDTO } from './tab-cities/city-dto.model';
import { CitiesRequest } from './tab-cities/city.model';
import { Flight, FlightOffer, FlightRequest } from './tab-flights/flight.model';

@Injectable({ providedIn: 'root' })
export class EstimatedCostService {
	private transportationEndPoint = 'package-options/1.0.0/transportationOffers';
	private countryCities = 'package-options/1.0.0/countryCities';
	private accommodations = 'package-options/1.0.0/accomodationOffers';

	private departureDate = this.requestService.getProperty('departureDate') as Moment;
	private returnDate = this.requestService.getProperty('returnDate') as Moment;

	private budgetCategory = this.requestService.getProperty('budgetCategory');

	private selectedFlightOffers: Array<FlightOffer>;
	private selectedCities: Array<CityDTO>;

	currentTabIndex = new Subject<number>();

	constructor(private http: HttpClient, private requestService: RequestService) {}

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
	}

	getSelectedCities(): Array<CityDTO> {
		return this.selectedCities;
	}

	getFlights(): Observable<Array<Flight>> {
		this.setIsLoading(true);
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			departure: (this.requestService.getProperty('departureDate') as Moment).format('YYYY-MM-DD'),
			citiesSequence: this.getSelectedCities().map(city => ({
				countryIso: city.countryIsoCode,
				cityIata: city.iataCode,
				numberOfNights: city.numberOfNights,
			})),
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
		};

		return this.http.post<Array<Flight>>(`${this.transportationEndPoint}/search`, flightRequest).pipe(
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

	setSelectedAccommodation() {}

	setIsLoading(isLoading: boolean) {
		this.requestService.isLoading.next(isLoading);
	}
}
