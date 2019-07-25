import { Station } from './station.model';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { EstimatedCostService } from '../estimated-cost.service';
import { CityAttractions, Attraction } from './attraction.model';
import { CityDTO } from '../tab-cities/city-dto.model';
import { FlightOffer } from '../tab-flights/flight.model';

@Component({
  selector: 'c-app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

  stations: Array<Station> = [];
  cityAttractionsList: Array<CityAttractions>;

  constructor(private service: EstimatedCostService) {
    service.getAttractions().subscribe(cityAttractionsList => {
      this.cityAttractionsList = cityAttractionsList; // keep the attractions we recieved from the backend
      let selectedFlightOffers: Array<FlightOffer> = service.getSelectedFlightOffers();
      let selectedCities: Array<CityDTO> = service.getSelectedCities();
      // then construct the corresponding 'stations' objects

      cityAttractionsList.forEach((cityAttraction) => {
        let stationCity: CityDTO = selectedCities.find(cityDTO => cityDTO.iataCode === cityAttraction.city.iataCode);
        let stationFlightOffer = selectedFlightOffers.find(flightOffer => flightOffer.segments[flightOffer.segments.length - 1].destination == cityAttraction.city.iataCode);
        // let stationHotel = ...;
        if (stationCity && stationFlightOffer) {
          let station: Station = {
            // city
            image: stationCity.thumbnail,
            name: stationCity.displayName,
            title: stationCity.displayName,
            description: stationCity.description,

            // cities
            depart_from: stationFlightOffer.segments[0].origin,
            arrive_to: stationFlightOffer.segments[stationFlightOffer.segments.length - 1].destination,

            // dates & duration of stay
            from: moment(stationFlightOffer.segments[0].departure).format("DD/MM/YYYY"),
            to: moment(stationFlightOffer.segments[0].departure).add('days', stationCity.numberOfNights).format("DD/MM/YYYY"),
            nights_count: stationCity.numberOfNights,

            // flights details
            duration: stationFlightOffer.totalDurationInWords,
            travel_time: moment(stationFlightOffer.segments[0].departure).format("hh:mm"),
            arrive_time: moment(stationFlightOffer.segments[0].departure).add('days', stationCity.numberOfNights).format("hh:mm"),

            hotel: "",
            hotel_rate: 0,
            hotel_address: "",
            activities: cityAttraction.attractions.map(attraction => ({
              night: [attraction.category]
            }))
          };

          this.stations.push(station);
        }
      });
    });
  }

  // constructor(service: SummaryService) {
  // 	this.stations = service.getStations();
  // }

  prev() {
    this.service.setCurrentTabIndex(0);
  }

  next() {

  }

}
