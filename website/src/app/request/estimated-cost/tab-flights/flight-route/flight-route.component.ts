import { FlightOffer } from './../flight-offer.model';

import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'c-app-flight-route',
    templateUrl: './flight-route.component.html',
    styleUrls: ['./flight-route.component.scss']
})
export class FlightRouteComponent implements OnInit {

    @Input() flightOffers: FlightOffer;

    constructor() { }

    ngOnInit() {

    }

}
