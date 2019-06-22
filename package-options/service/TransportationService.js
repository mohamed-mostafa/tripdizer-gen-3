let request = require('request');
let moment = require('moment');
let errorPayloadCreator = require('../utils/writer.js');
const MAX_NUMBER_OF_OFFERS_PER_LEG = 3;
const MAX_TRANSIT_TIME_IN_MINUTES = 8*60;
const FLIGHTS_ADAPTER_ENDPOINT = process.env.FLIGHTS_ADAPTER_ENDPOINT || 'http://localhost:8081/flights/1.0.0/flights'
const SQUARE_LOGOS_ROOT = "https://www.gstatic.com/flights/airline_logos/70px/";
const WIDE_LOGOS_ROOT = "https://www.skyscanner.net/images/airlines/small/";
/**
 * retrieve options of transportation between cities and countries for a package
 * Retrieve the recommended transportation options (flights or others) for a package, between the cities choosen by the client.
 *
 * language String 
 * transportationSearchRequest TransportationSearchRequest 
 * returns transportationLegOffers
 **/
exports.searchTransportation = function(language, transportationSearchRequest) {
    return new Promise(async function(resolve, reject) {
        try {
            // change JS date to moments
            let departureMoment = new moment(transportationSearchRequest.departure);
            let transportationLegs = [];
            
            // retrieve the leg from the origin to the first city
            let originToFirstCityLeg = await createFlightLegBetweenOriginAndDestination(transportationSearchRequest.origin, transportationSearchRequest.citiesSequence[0].cityIata, departureMoment, transportationSearchRequest.numberOfAdults, transportationSearchRequest.numberOfChildren, transportationSearchRequest.numberOfInfants, true);
            transportationLegs.push(originToFirstCityLeg);
    
            // retrieve legs between each city and the next city, after spending the nights in the city (except for the last city, which will be retrieved at the end)
            for (let i = 0; i < transportationSearchRequest.citiesSequence.length - 1; i++) {
                let legOrigin = transportationSearchRequest.citiesSequence[i].cityIata;
                let legDestination = transportationSearchRequest.citiesSequence[i+1].cityIata;
                departureMoment = departureMoment.add(transportationSearchRequest.citiesSequence[i].numberOfNights, 'Days');
                let transportationLeg = await createFlightLegBetweenOriginAndDestination(legOrigin, legDestination, departureMoment, transportationSearchRequest.numberOfAdults, transportationSearchRequest.numberOfChildren, transportationSearchRequest.numberOfInfants, false);
                transportationLegs.push(transportationLeg);
            }
    
            // retrieve the leg from the last city back to the origin
            departureMoment = departureMoment.add(transportationSearchRequest.citiesSequence[transportationSearchRequest.citiesSequence.length - 1].numberOfNights, 'Days');
            let lastCityToOriginLeg = await createFlightLegBetweenOriginAndDestination(transportationSearchRequest.citiesSequence[0].cityIata, transportationSearchRequest.origin, departureMoment, transportationSearchRequest.numberOfAdults, transportationSearchRequest.numberOfChildren, transportationSearchRequest.numberOfInfants, true);
            transportationLegs.push(lastCityToOriginLeg);
    
            if (transportationLegs) {
                resolve(transportationLegs);
            } else {
                resolve();
            }

        } catch (err) {
            reject(err);
        }
    });
  }

  function createFlightLegBetweenOriginAndDestination(origin, destination, departure, numberOfAdults, numberOfChildren, numberOfInfants, isInternationalLeg) {
    return new Promise(function(resolve, reject) {
        try {
            let transportationLeg = {origin: origin, destination: destination, departure: departure.toISOString()};
            let legSearchRequest = {
                departure: transportationLeg.departure,
                origin: transportationLeg.origin,
                destination: transportationLeg.destination,
                numberOfAdults: numberOfAdults,
                numberOfChildren: numberOfChildren,
                numberOfInfants: numberOfInfants
            }
            request.get({url: FLIGHTS_ADAPTER_ENDPOINT, qs: legSearchRequest, json: true}, function(err,httpResponse,body) { 
                if (err) {
                    reject(err);
                } else {
                    let legFlightOffers = body;
                    if (isInternationalLeg) {
                        let filteredLegFlightOffers = filterInternationalOffers(legFlightOffers);
                        transportationLeg.flightOffers = filteredLegFlightOffers;
                        resolve(transportationLeg);
                    } else {
                        let filteredLegFlightOffers = filterInternalOffers(legFlightOffers);
                        transportationLeg.flightOffers = filteredLegFlightOffers;
                        resolve(transportationLeg);
                    }
                }
            });
        } catch (err) {
            reject(err);
        }
    });
  }

  
  function filterInternationalOffers(flightOffers) {
      // offers are already sorted by price since we're using low fare search from amadeus
      if (flightOffers.length <= MAX_NUMBER_OF_OFFERS_PER_LEG) {
          return flightOffers;
      }
      let filteredflightOffers = [];
      for (let i = 0; i < flightOffers.length; i++) {
        let currentOffer = flightOffers[i];
        // find out if the airline name doesn't exists before - we have to show the cheapest in every airline and don't repeat airlines
        let airlineFound = false;
        for (let j = 0; j < filteredflightOffers.length; j++) {
            if (currentOffer.flightLegs[0].carrier.iataCode == filteredflightOffers[j].flightLegs[0].carrier.iataCode) {
                airlineFound = true;
                break;
            }
        }
        if (!airlineFound) {
            if (currentOffer.flightLegs[0].transitDurationInMinutes < MAX_TRANSIT_TIME_IN_MINUTES ) { // also transit has to be less than a limit
                // set the logos to the carrier before adding it
                currentOffer.flightLegs[0].carrier.squareLogo = SQUARE_LOGOS_ROOT + currentOffer.flightLegs[0].carrier.iataCode + ".png";
                currentOffer.flightLegs[0].carrier.wideLogo = WIDE_LOGOS_ROOT + currentOffer.flightLegs[0].carrier.iataCode + ".png";
                filteredflightOffers.push(currentOffer);
            }
        }

        if (filteredflightOffers.length == MAX_NUMBER_OF_OFFERS_PER_LEG) {
            break;
        }
      }
      return filteredflightOffers;
  }

  function filterInternalOffers(flightOffers) {
    // offers are already sorted by price since we're using low fare search from amadeus
    if (flightOffers.length <= MAX_NUMBER_OF_OFFERS_PER_LEG) {
        return flightOffers;
    }
    let filteredflightOffers = [];
    for (let i = 0; i < flightOffers.length; i++) {
      let currentOffer = flightOffers[i];
      // find out if the airline name doesn't exists before - we have to show the cheapest in every airline and don't repeat airlines
      let airlineFound = false;
      for (let j = 0; j < filteredflightOffers.length; j++) {
          if (currentOffer.flightLegs[0].carrier.iataCode == filteredflightOffers[j].flightLegs[0].carrier.iataCode) {
              airlineFound = true;
              break;
          }
      }
      if (!airlineFound) {
          if (currentOffer.flightLegs[0].transitDurationInMinutes == 0 ) { // Internal flights should be direct
              // set the logos to the carrier before adding it
              currentOffer.flightLegs[0].carrier.squareLogo = SQUARE_LOGOS_ROOT + currentOffer.flightLegs[0].carrier.iataCode + ".png";
              currentOffer.flightLegs[0].carrier.wideLogo = WIDE_LOGOS_ROOT + currentOffer.flightLegs[0].carrier.iataCode + ".png";
              filteredflightOffers.push(currentOffer);
          }
      }

      if (filteredflightOffers.length == MAX_NUMBER_OF_OFFERS_PER_LEG) {
          break;
      }
    }
    return filteredflightOffers;
}