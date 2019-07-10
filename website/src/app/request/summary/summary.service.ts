import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Station } from './station.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private endPoint = 'request/stations' /*+ (lang ? '?lang=' + lang : '')*/;
  private stations: Array<Station> = [
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

  constructor(private http: HttpClient) { }

  getStations(): Observable<Array<Station>> {
    return of(this.stations);
    // return this.http.get<Array<any>>(`${this.endPoint}s`);
  }
}
