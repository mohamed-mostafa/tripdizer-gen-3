import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Country } from '../../shared/models/country.model';
import { RequestService } from '../request.service';
import { TravelingFrom } from '../traveling-from/traveling-from.model';
import { AttractionsRequest, CityAttractions } from './summary/attraction.model';
import { Station } from './summary/station.model';
import { Accommodation, AccommodationRequest, Hotel } from './tab-accommodation/accommodation.model';
import { CityDTO } from './tab-cities/city-dto.model';
import { CitiesRequest } from './tab-cities/city.model';
import { CitySequence, Flight, FlightOffer, FlightRequest } from './tab-flights/flight.model';
import { TranslateService } from '@ngx-translate/core';

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
	summaryStations: Array<Station> = [];
	cityAttractionsList: Array<CityAttractions>;

	currentTabIndex = new Subject<number>();
	finishGetAttractions = new Subject<boolean>();

	constructor(private http: HttpClient, private requestService: RequestService, public translate: TranslateService) {}

	getDepartureDate(): Moment {
		return this.departureDate;
	}

	getReturnDate(): Moment {
		return this.returnDate;
	}

	getCities(): Observable<Array<CityDTO>> {
		this.requestService.isLoading.next({
			show: true,
			message: this.translate.instant('request.estimated_cost.loading_messages.cities_tab_message'),
		});
		const citiesRequest: CitiesRequest = { countries: this.getSelectedCountries().map(c => c.ISOCode) };
		return this.http.post<Array<CityDTO>>(`${this.countryCities}/search`, citiesRequest).pipe(
			tap(() => {
				this.setIsLoading(false, '');
				this.requestService.isLoading.next({ show: false, message: '' });
			})
		);
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
		this.selectedCities = selectedCities;
		this.requestService.setProperty('selectedCities', selectedCities);
	}

	getSelectedCities(): Array<CityDTO> {
		return this.selectedCities;
	}

	getFlights(): Observable<Array<Flight>> {
		this.setIsLoading(true, this.translate.instant('request.estimated_cost.loading_messages.flights_tab_message'));
		const citiesSequence: Array<CitySequence> = this.getSelectedCities().map(city => ({
			countryIso: city.countryIsoCode,
			cityIata: city.iataCode,
			numberOfNights: city.numberOfNights,
		}));
		const flightRequest: FlightRequest = {
			origin: (this.requestService.getProperty('travelingFrom') as TravelingFrom).iataCode,
			departure: this.departureDate.locale('en').format('YYYY-MM-DD'),
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
				this.setIsLoading(false, '');
			})
		);
	}

	setSelectedFlightOffers(flightOffers: Array<FlightOffer>): void {
		this.selectedFlightOffers = flightOffers;
		this.requestService.setProperty('flightOffers', flightOffers);
	}

	getFlightsTotalCost(): number {
		return Object.keys(this.selectedFlightOffers).reduce((pv, cv) => pv + +this.selectedFlightOffers[cv].price, 0);
	}

	setCurrentTabIndex(index) {
		this.currentTabIndex.next(index);
	}

	getAccommodation(): Observable<Array<Accommodation>> {
		this.setIsLoading(
			true,
			this.translate.instant('request.estimated_cost.loading_messages.accommodation_tab_message')
		);
		const cities: Array<{ cityIata: string; numberOfNights: number }> = [];
		for (let x = 0; x < this.selectedCities.length; x++) {
			cities.push({ cityIata: this.selectedCities[x].iataCode, numberOfNights: this.selectedCities[x].numberOfNights });
		}

		this.budgetCategory = this.requestService.getProperty('budgetCategory');
		let accommodationDesiredCostPerPerson = 0;
		if (this.budgetCategory === 1) {
			// ownBudget
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
			cities: cities,
			numberOfAdults: this.requestService.getProperty('adultsNumber') as number,
			numberOfChildren: this.requestService.getProperty('kidsNumber') as number,
			numberOfInfants: this.requestService.getProperty('infantsNumber') as number,
			desiredCostPerPerson: accommodationDesiredCostPerPerson,
		};
		return this.http.post<Array<Accommodation>>(`${this.accommodations}/search`, accommodationRequest).pipe(
			tap(() => {
				this.setIsLoading(false, '');
			})
		);
	}

	setSelectedHotels(selectedHotels) {
		this.requestService.setProperty('selectedHotels', selectedHotels);
		this.selectedHotels = selectedHotels;
	}

	getHotelsTotalCost() {
		let totalCost = 0;
		for (let t = 0; t < this.selectedHotels.length; t++) {
			totalCost = this.selectedHotels[t].price + totalCost;
		}
		return totalCost;
	}

	setIsLoading(isLoading: boolean, message: string) {
		this.requestService.isLoading.next({ show: isLoading, message: message });
	}

	getAttractions(): Observable<Array<CityAttractions>> {
		this.setIsLoading(true, '');
		const cities: Array<{ cityIata: string; numberOfNights: number }> = [];
		for (let x = 0; x < this.selectedCities.length; x++) {
			cities.push({ cityIata: this.selectedCities[x].iataCode, numberOfNights: this.selectedCities[x].numberOfNights });
		}
		const attractionsRequest: AttractionsRequest = { cities: cities };
		return this.http.post<Array<CityAttractions>>(`${this.attractionsEndPoint}/search`, attractionsRequest).pipe(
			tap(() => {
				this.setIsLoading(false, '');
				this.finishGetAttractions.next(true);
			})
		);
	}

	getSelectedFlightOffers(): Array<FlightOffer> {
		return this.selectedFlightOffers;
	}

	getSummaryStations(): Array<Station> {
		this.getAttractions().subscribe(cityAttractionsList => {
			this.cityAttractionsList = cityAttractionsList; // keep the attractions we received from the backend
			this.requestService.setProperty('selectedAttractions', cityAttractionsList);

			const selectedFlightOffers: Array<FlightOffer> = this.getSelectedFlightOffers();
			const selectedCities: Array<CityDTO> = this.getSelectedCities();
			const selectedHotels: Array<Hotel> = this.selectedHotels;

			// then construct the corresponding 'stations' objects
			this.summaryStations.splice(0, this.summaryStations.length);
			const tripStartDate = moment(this.requestService.getProperty('departureDate'));

			cityAttractionsList.forEach(cityAttraction => {
				const stationCity: CityDTO = selectedCities.find(cityDTO => cityDTO.iataCode === cityAttraction.city.iataCode);
				const stationFlightOffer = selectedFlightOffers.find(
					flightOffer => flightOffer.destinationCityIata === cityAttraction.city.iataCode
				);
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
							.add('days', stationCity.numberOfNights)
							.format('DD/MM'),

						// flights
						flightDataExists: stationFlightOffer ? true : false,
						depart_from: stationFlightOffer ? stationFlightOffer.segments[0].originDetails : 'origin',
						arrive_to: stationFlightOffer
							? stationFlightOffer.segments[stationFlightOffer.segments.length - 1].destinationDetails
							: 'destination',
						duration: stationFlightOffer ? stationFlightOffer.totalDurationInWords : 'Unknown',
						travel_time: stationFlightOffer
							? moment(stationFlightOffer.segments[0].departure).format('DD/MM HH:mm')
							: 'Unknown time',
						arrive_time: stationFlightOffer
							? moment(stationFlightOffer.segments[stationFlightOffer.segments.length - 1].return).format('DD/MM HH:mm')
							: 'unknown time',

						// accommodation
						accommodationDataExists: stationHotel ? true : false,
						hotel: stationHotel ? stationHotel.name : 'None Selected',
						hotel_rate: stationHotel ? stationHotel.stars : 0,
						hotel_address: stationHotel ? stationHotel.address : 'No Hotel Selected',

						// activities
						activities: cityAttraction.attractions.map(attraction => ({
							night: [attraction.category],
						})),

						isReturnStation: false,
					};

					this.summaryStations.push(station);
				}
				// jump to next date
				tripStartDate.add('days', stationCity.numberOfNights);
			});

			// add an extra station, which is the origin step (e.g. return to cairo)
			if (this.summaryStations.length > 0) {
				const lastStationAirport = this.requestService.getProperty('travelingFrom');
				const lastStationFlightOffer = selectedFlightOffers.find(
					flightOffer => flightOffer.destinationCityIata === lastStationAirport.iataCode
				);
				const lastStation: Station = {
					// city
					image: '',
					name: lastStationAirport.name,
					title: lastStationAirport.name,
					description: '',
					nights_count: 0,

					// flights
					flightDataExists: lastStationFlightOffer ? true : false,
					depart_from: lastStationFlightOffer ? lastStationFlightOffer.segments[0].originDetails : 'origin',
					arrive_to: lastStationFlightOffer
						? lastStationFlightOffer.segments[lastStationFlightOffer.segments.length - 1].destinationDetails
						: 'destination',
					duration: lastStationFlightOffer ? lastStationFlightOffer.totalDurationInWords : 'Unknown',
					travel_time: lastStationFlightOffer
						? moment(lastStationFlightOffer.segments[0].departure).format('DD/MM HH:mm')
						: 'Unknown time',
					arrive_time: lastStationFlightOffer
						? moment(lastStationFlightOffer.segments[lastStationFlightOffer.segments.length - 1].return).format(
								'DD/MM HH:mm'
						  )
						: 'unknown time',

					// dates
					from: lastStationFlightOffer
						? moment(lastStationFlightOffer.segments[lastStationFlightOffer.segments.length - 1].return).format('DD/MM')
						: '',
					to: null,

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
		const flightsTotalCost = this.getFlightsTotalCost();
		this.getHotelsTotalCost();
		return flightsTotalCost + this.getHotelsTotalCost();
	}
}
