let request = require('request');
let moment = require('moment');
const MAX_NUMBER_OF_OFFERS_PER_LEG = 3;
const MAX_TRANSIT_TIME_IN_MINUTES = 8 * 60;
const FLIGHTS_ADAPTER_ENDPOINT = process.env.FLIGHTS_ADAPTER_ENDPOINT || 'http://localhost:8085/flights/1.0.0/flights';
const MASTER_DATA_ENDPOINT = process.env.MASTER_DATA_ENDPOINT || 'http://localhost:8083/master-data';
const SQUARE_LOGOS_ROOT = "https://www.gstatic.com/flights/airline_logos/70px/";
const WIDE_LOGOS_ROOT = "https://www.skyscanner.net/images/airlines/small/";
const MEDIA_STORAGE_BASE_URL = process.env.MEDIA_STORAGE_BASE_URL || 'https://storage.cloud.google.com/tripdizer-dev.appspot.com';
const FLIGHT_COST_THRESHOLD = 15000;
const FLIGHT_PROFIT_BELOW_THRESHOLD = 300;
const FLIGHT_PROFIT_ABOVE_THRESHOLD = 500;
/**
 * retrieve options of transportation between cities and countries for a package
 * Retrieve the recommended transportation options (flights or others) for a package, between the cities choosen by the client.
 *
 * language String 
 * transportationSearchRequest TransportationSearchRequest 
 * returns transportationLegOffers
 **/
exports.searchTransportation = function (language, transportationSearchRequest) {
    return new Promise(async function (resolve, reject) {
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
                let legDestination = transportationSearchRequest.citiesSequence[i + 1].cityIata;
                departureMoment = departureMoment.add(transportationSearchRequest.citiesSequence[i].numberOfNights, 'Days');
                let transportationLeg = await createFlightLegBetweenOriginAndDestination(legOrigin, legDestination, departureMoment, transportationSearchRequest.numberOfAdults, transportationSearchRequest.numberOfChildren, transportationSearchRequest.numberOfInfants, false);
                transportationLegs.push(transportationLeg);
            }

            // retrieve the leg from the last city back to the origin
            departureMoment = departureMoment.add(transportationSearchRequest.citiesSequence[transportationSearchRequest.citiesSequence.length - 1].numberOfNights, 'Days');
            let lastCityToOriginLeg = await createFlightLegBetweenOriginAndDestination(transportationSearchRequest.citiesSequence[transportationSearchRequest.citiesSequence.length - 1].cityIata, transportationSearchRequest.origin, departureMoment, transportationSearchRequest.numberOfAdults, transportationSearchRequest.numberOfChildren, transportationSearchRequest.numberOfInfants, true);
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
    return new Promise(async function (resolve, reject) {
        try {
            let originCity = await getCityByIata(origin);
            let destinationCity = await getCityByIata(destination);
            let transportationLeg = { origin: originCity, destination: destinationCity, departure: departure.toISOString(), flightOffers: [] };
            let legSearchRequest = {
                departure: transportationLeg.departure,
                origin: transportationLeg.origin.iataCode,
                destination: transportationLeg.destination.iataCode,
                numberOfAdults: numberOfAdults,
                numberOfChildren: numberOfChildren,
                numberOfInfants: numberOfInfants
            }
            request.get({ url: FLIGHTS_ADAPTER_ENDPOINT, qs: legSearchRequest, json: true }, function (err, httpResponse, body) {
                if (err || httpResponse.statusCode != 200) {
                    // reject(err || httpResponse.statusMessage);
                    console.error("Failed to retrieve offers for leg: " + transportationLeg);
                    console.error(err || httpResponse.statusMessage);
                    resolve(transportationLeg);
                } else {
                    let legFlightOffers = body; // offers coming form flights adapter
                    if (legFlightOffers) {
                        // legFlightOffers = applyFlightOffersCleansing(legFlightOffers, legSearchRequest); // sometimes the response contains flghts to nearest cities, and sometimes even contains trains !!!
                        if (isInternationalLeg) {
                            let filteredLegFlightOffers = filterInternationalOffers(legFlightOffers);
                            transportationLeg.flightOffers = filteredLegFlightOffers;
                            resolve(transportationLeg);
                        } else {
                            let filteredLegFlightOffers = filterInternalOffers(legFlightOffers);
                            transportationLeg.flightOffers = filteredLegFlightOffers;
                            resolve(transportationLeg);
                        }
                    } else {
                        console.warn("No flight offers found for leg: " + legSearchRequest);
                        resolve(transportationLeg);
                    }
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

function applyFlightOffersCleansing(legFlightOffers, legSearchRequest) {
    return legFlightOffers.filter(legFlightOffer => legFlightOffer.flightLegs[0].origin == legSearchRequest.origin && legFlightOffer.flightLegs[0].destination == legSearchRequest.destination);
}

function filterInternationalOffers(flightOffers) {
    let filteredflightOffers = [];
    // offers are already sorted by price since we're using low fare search from amadeus
    if (flightOffers.length <= MAX_NUMBER_OF_OFFERS_PER_LEG) {
        flightOffers.forEach(flightOffer => {
            filteredflightOffers.push(createPackageOptiosOfferFromFlightsAdapterOffer(flightOffer));
        });
        return filteredflightOffers;
    }
    for (let i = 0; i < flightOffers.length; i++) {
        let currentOffer = flightOffers[i];
        // find out if the airline name doesn't exists before - we have to show the cheapest in every airline and don't repeat airlines
        let airlineFound = false;
        for (let j = 0; j < filteredflightOffers.length; j++) {
            // compare the carriers from the flights-adapter offer with the carrier in the package-options offer
            if (currentOffer.flightLegs[0].carrier.iataCode == filteredflightOffers[j].carrier.iataCode) {
                airlineFound = true;
                break;
            }
        }
        if (!airlineFound) {
            if (currentOffer.flightLegs[0].transitDurationInMinutes < MAX_TRANSIT_TIME_IN_MINUTES) { // also transit has to be less than a limit
                // create a new offer in package-options format
                let newOffer = createPackageOptiosOfferFromFlightsAdapterOffer(currentOffer);
                filteredflightOffers.push(newOffer);
            }
        }

        if (filteredflightOffers.length == MAX_NUMBER_OF_OFFERS_PER_LEG) {
            break;
        }
    }
    return filteredflightOffers;
}

function filterInternalOffers(flightOffers) {
    let filteredflightOffers = [];
    // offers are already sorted by price since we're using low fare search from amadeus
    if (flightOffers.length <= MAX_NUMBER_OF_OFFERS_PER_LEG) {
        flightOffers.forEach(flightOffer => {
            filteredflightOffers.push(createPackageOptiosOfferFromFlightsAdapterOffer(flightOffer));
        });
        return filteredflightOffers;
    }
    for (let i = 0; i < flightOffers.length; i++) {
        let currentOffer = flightOffers[i];
        // find out if the airline name doesn't exists before - we have to show the cheapest in every airline and don't repeat airlines
        let airlineFound = false;
        for (let j = 0; j < filteredflightOffers.length; j++) {
            // compare the carriers from the flights-adapter offer with the carrier in the package-options offer
            if (currentOffer.flightLegs[0].carrier.iataCode == filteredflightOffers[j].carrier.iataCode) {
                airlineFound = true;
                break;
            }
        }
        if (!airlineFound) {
            if (currentOffer.flightLegs[0].transitDurationInMinutes == 0) { // Internal flights should be direct
                // create a new offer in package-options format
                let newOffer = createPackageOptiosOfferFromFlightsAdapterOffer(currentOffer);
                filteredflightOffers.push(newOffer);
            }
        }
        if (filteredflightOffers.length == MAX_NUMBER_OF_OFFERS_PER_LEG) {
            break;
        }
    }
    return filteredflightOffers;
}

function createPackageOptiosOfferFromFlightsAdapterOffer(flightOffer) {
    // at the moment, we only support one-way flights, so we always use flightLegs[0]
    let newOffer = {
        // add profit margin
        price: flightOffer.price <= FLIGHT_COST_THRESHOLD ? parseInt(flightOffer.price) + FLIGHT_PROFIT_BELOW_THRESHOLD : parseInt(flightOffer.price) + FLIGHT_PROFIT_ABOVE_THRESHOLD,
        currency: flightOffer.currency,
        originCityIata: flightOffer.originCityIata,
        destinationCityIata: flightOffer.destinationCityIata,
        totalDurationInWords: flightOffer.flightLegs[0].totalDurationInWords,
        transitDurationInWords: flightOffer.flightLegs[0].transitDurationInWords,
        totalDurationInMinutes: flightOffer.flightLegs[0].totalDurationInMinutes,
        transitDurationInMinutes: flightOffer.flightLegs[0].transitDurationInMinutes,
        segments: flightOffer.flightLegs[0].segments,
        carrier: {
            iataCode: flightOffer.flightLegs[0].carrier.iataCode,
            name: flightOffer.flightLegs[0].carrier.name,
            displayName: flightOffer.flightLegs[0].carrier.displayName,
            squareLogo: SQUARE_LOGOS_ROOT + flightOffer.flightLegs[0].carrier.iataCode + ".png",
            wideLogo: WIDE_LOGOS_ROOT + flightOffer.flightLegs[0].carrier.iataCode + ".png"
        }
    };
    return newOffer
}

function getCityByIata(cityIata, language) {
    return new Promise(function (resolve, reject) {
        var cityUrl = MASTER_DATA_ENDPOINT + "/city/" + cityIata;

        request.get({ url: cityUrl, json: true }, function (error, response, city) {
            if (error) {
                reject(error);
            } else if (response.statusCode != 200) {
                reject(response.statusMessage);
            } else {
                resolve({
                    iataCode: city != null ? city.iataCode : cityIata,
                    name: city != null ? (language == 'ar' ? city.arName : city.enName) : null,
                    latitude: city != null ? city.lat : null,
                    longitude: city != null ? city.lng : null,
                });
            }
        }
        );
    })
};