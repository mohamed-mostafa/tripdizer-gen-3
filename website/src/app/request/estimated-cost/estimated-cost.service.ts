import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable, BehaviorSubject } from 'rxjs';
import { RequestService } from '../request.service';
import { TravelingFrom } from '../traveling-from/traveling-from.model';
import { CityDTO } from './tab-cities/city-dto.model';
import { Flight, FlightOffer, FlightRequest } from './tab-flights/flight.model';

@Injectable({ providedIn: 'root' })
export class EstimatedCostService {
	private transportationEndPoint = 'package-options/1.0.0/transportationOffers';
	private countryCities = 'package-options/1.0.0/countryCities';

	private departureDate = this.requestService.getProperty('departureDate') as Moment;
	private returnDate = this.requestService.getProperty('returnDate') as Moment;

	private budgetCategory = this.requestService.getProperty('budgetCategory');

	private selectedFlightOffers: Array<FlightOffer>;
	private selectedCities: Array<CityDTO>;

	private currentTabIndexSubject: BehaviorSubject<number>;
	public currentTabIndex: Observable<number>;
	private currentTabNumber: number;

	constructor(private http: HttpClient, private requestService: RequestService) {
		this.currentTabIndexSubject = new BehaviorSubject<number>(this.currentTabNumber);
		this.currentTabIndex = this.currentTabIndexSubject.asObservable();
	}

	getCities(): Observable<Array<CityDTO>> {
		console.log();
		return this.http.post<Array<CityDTO>>(`${this.countryCities}/search`, { 'countries': this.getSelectedCountriesISO() });
	}

	getNumberOfNights(): number {
		return this.returnDate.diff(this.departureDate, 'days');
	}

	getSelectedCountriesISO(): Array<string> {
		return this.requestService.getProperty('countries');
	}

	setSelectedCities(selectedCities: Array<CityDTO>): void {
		this.selectedCities = selectedCities;
		this.requestService.setProperty('selectedCities', selectedCities);
	}

	getSelectedCities(): Array<CityDTO> {
		return this.selectedCities;
	}

	getFlights(): Observable<Array<Flight>> {
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			departure: (this.requestService.getProperty('departureDate') as Moment).format('YYYY-MM-DD'),
			citiesSequence: this.getSelectedCities(),
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
		};

		return this.http.post<Array<Flight>>(`${this.transportationEndPoint}/search`, flightRequest);
	}

	setSelectedFlightOffers(flightOffers: Array<FlightOffer>): void {
		this.selectedFlightOffers = flightOffers;
		this.requestService.setProperty('flightOffers', flightOffers);
	}

	setCurrentTabIndex(index) {
		this.currentTabNumber = index;
		this.currentTabIndexSubject.next(this.currentTabNumber);
	}
}
