import { FlightOffer } from './../estimated-cost/tab-flights/flight-offer.model';
import { CityDTO } from './../estimated-cost/tab-cities/city-dto.model';
import { Hotel } from './../estimated-cost/tab-accommodation/accommodation.model';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RequestService } from './../request.service';
import { CityAttractions, AttractionsRequest } from './attraction.model';
import { Station } from './station.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Injectable({ providedIn: 'root' })
export class SummaryService {
	attractionsEndPoint = 'package-options/1.0.0/cityAttractions';

	summaryStations: Array<Station> = [];
	cityAttractionsList: Array<CityAttractions> = [];

	constructor(private requestService: RequestService, private http: HttpClient) {}

	getAttractions(): Observable<Array<CityAttractions>> {
		this.setIsLoading(true, '');
		const cities: Array<{ cityIata: string; numberOfNights: number }> = [];
		const citiesWithNights = this.getCitiesWithNights();
		if (citiesWithNights && citiesWithNights.length > 0) {
			for (const city of citiesWithNights) {
				cities.push({ cityIata: city.iataCode, numberOfNights: city.numberOfNights });
			}
		}
		const attractionsRequest: AttractionsRequest = { cities };
		return this.http.post<Array<CityAttractions>>(`${this.attractionsEndPoint}/search`, attractionsRequest).pipe(
			tap(() => {
				this.setIsLoading(false, '');
			})
		);
	}

	getSummaryStations(): Array<Station> {
		this.getAttractions().subscribe(cityAttractionsList => {
			this.cityAttractionsList = cityAttractionsList; // keep the attractions we received from the backend
			this.requestService.setProperty('selectedAttractions', cityAttractionsList);

			const selectedFlightOffers: Array<FlightOffer> = this.getSelectedFlightOffers();
			const citiesWithNights: Array<CityDTO> = this.getCitiesWithNights();
			const selectedHotels: Array<Hotel> = [] /* this.getSelectedHotels()*/;

			// then construct the corresponding 'stations' objects
			this.summaryStations.splice(0, this.summaryStations.length);
			const tripStartDate = moment(this.requestService.getProperty('departureDate'));

			cityAttractionsList.forEach(cityAttraction => {
				const stationCity: CityDTO = citiesWithNights.find(
					cityDTO => cityDTO.iataCode === cityAttraction.city.iataCode
				);
				let stationFlightLeg = null;
				selectedFlightOffers.forEach(flightOffer => {
					stationFlightLeg = flightOffer.flightLegs.find(
						flightLeg =>
							flightLeg.destination.iataCode === cityAttraction.city.iataCode.substring(0, 3) &&
							this.summaryStations.find(
								summaryStation => summaryStation.arrive_code === flightLeg.destination.iataCode
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

	getCitiesWithNights(): Array<CityDTO> {
		const cities = this.requestService.getProperty('cities');
		if (cities.length > 0) {
			const selectedCities = cities.filter(c => c.selected);
			const returnDate = this.requestService.getProperty('returnDate') as Moment;
			const departureDate = this.requestService.getProperty('departureDate') as Moment;
			const numberOfNights = returnDate.diff(departureDate, 'days');
			const floorDivision = Math.floor(numberOfNights / selectedCities.length);
			const modulus = numberOfNights % selectedCities.length;
			return selectedCities.map((city: CityDTO, index) => ({
				...city,
				numberOfNights: index === 0 ? floorDivision + modulus : floorDivision,
			}));
		}
	}

	getSelectedFlightOffers() {
		return this.requestService.getProperty('flightOffers').filter(offer => offer.selected);
	}

	getTotalCost() {
		let hotelsCosts = 0;
		this.requestService.getProperty('accommodationOffers').map(offer => {
			offer.hotels
				.filter(hotel => hotel.selected)
				.map(h => {
					hotelsCosts = +h.price;
				});
		});
		const flightsCosts = Object.keys(this.getSelectedFlightOffers()).reduce(
			(pv, cv) => pv + +this.getSelectedFlightOffers()[cv].price,
			0
		);
		return { hotels: hotelsCosts, flights: flightsCosts };
	}

	setIsLoading(isLoading: boolean, message: string) {
		this.requestService.isLoading.next({ show: isLoading, message });
	}
}
