let request = require('request');
let moment = require('moment');
let errorPayloadCreator = require('../utils/writer.js');
const MAX_NUMBER_OF_OFFERS_PER_LEG = 3;

exports.searchTransportation = function(departure,citiesSequence,numberOfAdults,language,_return,numberOfChildren,numberOfInfants) {
    return new Promise(async function(resolve, reject) {
  
      // change JS dates into moments
      let returnMoment = new moment(_return);
      let departureMoment = new moment(departure);
  
      // capture citiesSequence (swagger UI has an issue here that it sends all cities in the first element of the array)
      if (citiesSequence.length == 1) {
        let citiesSequenceString = citiesSequence[0];
        if (citiesSequenceString.includes(",")) {
          citiesSequence = citiesSequenceString.split(",");
        }
      }
  
      if (_return) { // if the return date is provided, the cities has to be at least 3, where first and last items are city of departure and city of return
        if (citiesSequence.length < 3) {
            var error = errorPayloadCreator.respondWithCode(400, "If a return date is specified, number of cities has to be at least 3")
            reject(error);
        } else {
            // distribute days evenly among cities
            let totalNumberOfDays = returnMoment.diff(departureMoment, 'days');
            let numberOfCitiesToStayIn = citiesSequence.length - 2;
            let numberOfDaysPerCity = totalNumberOfDays / numberOfCitiesToStayIn;
            let transportationLegs = [];
            
            // loop over all cities except the last one (should be the city that the client is returning to)
            for (let i = 0; i < citiesSequence.length - 1; i++) {
                let legOrigin = citiesSequence[i];
                let legDestination = citiesSequence[i+1];
                let legDeparture = departureMoment.add(numberOfDaysPerCity * i);
                let transportationLeg = await createFlightLegBetweenOriginAndDestination(legOrigin, legDestination, legDeparture, numberOfAdults, numberOfChildren, numberOfInfants);
                transportationLegs.push(transportationLeg);
            }
            if (transportationLegs) {
                resolve(transportationLegs);
            } else {
                resolve();
            }
        }
      } else { // if no return date is specified, cities has to be only 2
        if (citiesSequence.length != 2) {
            var error = errorPayloadCreator.respondWithCode(400, "If a return date is not specified, then cities has to be exactly 2 - an origin and a destination")
            reject(error);
        } else {
            try {
                let transportationLegs = [];
                let transportationLeg = await createFlightLegBetweenOriginAndDestination(citiesSequence[0], citiesSequence[1], departureMoment, numberOfAdults, numberOfChildren, numberOfInfants);
                transportationLegs.push(transportationLeg);
                resolve(transportationLegs);
            } catch (err) {
                reject(err, 500);
            }
        } 
      }
    });
  }

  function createFlightLegBetweenOriginAndDestination(origin, destination, departure, numberOfAdults, numberOfChildren, numberOfInfants) {
    return new Promise(function(resolve, reject) {
        let transportationLeg = {origin: origin, destination: destination, departure: departure.toISOString()};
        let legSearchRequest = {
            departure: transportationLeg.departure,
            origin: transportationLeg.origin,
            destination: transportationLeg.destination,
            numberOfAdults: numberOfAdults,
            numberOfChildren: numberOfChildren,
            numberOfInfants: numberOfInfants
        }
        request.get({url:'http://localhost:8081/tripdizer-flights-api/1.0.0/flights', qs: legSearchRequest, json: true}, function(err,httpResponse,body) { 
            if (err) {
                reject(err);
            } else {
                let legFlightOffers = body;
                let filteredLegFlightOffers = filterOffers(legFlightOffers);
                transportationLeg.flightOffers = filteredLegFlightOffers;
                resolve(transportationLeg);
            }
        });
    });
  }

  
  function filterOffers(flightOffers) {
      // offers are already sorted by price since we're using low fare search from amadeus
      if (flightOffers.length <= MAX_NUMBER_OF_OFFERS_PER_LEG) {
          return flightOffers;
      }
      let filteredflightOffers = [];
      for (let i = 0; i < flightOffers.length; i++) {
        let currentOffer = flightOffers[i];
        // find out if the airline name doesn't exists before
        let airlineFound = false;
        for (let j = 0; j < filteredflightOffers.length; j++) {
            if (currentOffer.flightLegs[0].carrier == filteredflightOffers[j].flightLegs[0].carrier) {
                airlineFound = true;
                break;
            }
        }
        if (!airlineFound) {
            filteredflightOffers.push(currentOffer);
        }

        if (filteredflightOffers.length == MAX_NUMBER_OF_OFFERS_PER_LEG) {
            break;
        }
      }
      return filteredflightOffers;
  }