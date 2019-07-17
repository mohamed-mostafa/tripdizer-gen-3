let httpRequest = require('request');
let moment = require('moment');

const MASTER_DATA_ENDPOINT = process.env.MASTER_DATA_ENDPOINT || 'http://localhost:8083/master-data'
const MAX_NUMBER_OF_HOTELS_PER_CITY = 3;
const MEDIA_STORAGE_BASE_URL = process.env.MEDIA_STORAGE_BASE_URL || 'https://storage.cloud.google.com/tripdizer-dev.appspot.com';
/**
 * retrieve options of accomodations for a package
 * By passing in the appropriate options, you can search for available hotels in the system
 *
 * language String 
 * accomomdationSearchRequest AccomomdationSearchRequest 
 * returns accomodationOffers
 **/
exports.searchAccomodations = function (language, accomomdationSearchRequest) {
    return new Promise(async function (resolve, reject) {
        var citiesNumberOfNightPairs = accomomdationSearchRequest.cities;
        var selectedBudgetCategory = accomomdationSearchRequest.budgetCategory;
        let arrivalMoment = new moment(accomomdationSearchRequest.arrival); // start moment

        var accomodationOffers = [];
        for (var i = 0; i < citiesNumberOfNightPairs.length; i++) {
            var cityIata = citiesNumberOfNightPairs[i].cityIata;
            var cityArrival = new moment(arrivalMoment); // arrivalMoment will be moved forward at the end of the loop
            var cityDeparture = new moment(arrivalMoment).add(citiesNumberOfNightPairs[i].numberOfNights, 'Days');

            try {
                var hotelCity = await getCityByIata(cityIata);
                if (!hotelCity) continue;
                var newAccomodationOffer = {
                    city: {
                        // here goes the city
                        name: hotelCity.enName,
                        displayName: language == 'ar' ? hotelCity.arName : hotelCity.enName,
                        iataCode: hotelCity.iataCode,
                        country: hotelCity.countryEnName,
                        countryDisplayName: language == 'ar' ? hotelCity.countryArName : hotelCity.countryEnName,
                        countryIsoCode: hotelCity.countryIsoCode,
                        coordinates: hotelCity.lng + ", " + hotelCity.lat,
                        thumbnail: MEDIA_STORAGE_BASE_URL + "/cities/" + hotelCity.iataCode + ".png",
                        // interests: [] // FIX THIS
                    },
                    hotels: [],
                }

                var cityHotelsList = await getHotelsOfCity(cityIata);
                cityHotelsList.filter(hotel => hotel.budgetCategoryName.toLowerCase() == selectedBudgetCategory.toLowerCase()).forEach(hotel => {
                    var newHotel = {
                        name: hotel.enName,
                        displaName: language == 'ar' ? hotel.arName : hotel.enName,
                        description: language == 'ar' ? hotel.arDescription : hotel.enDescription,
                        city: hotelCity.enName,
                        thumbnail: MEDIA_STORAGE_BASE_URL + "/hotels/" + hotel.id + ".png",
                        address: hotel.address,
                        stars: hotel.stars,
                        checkin: cityArrival.toISOString(),
                        checkout: cityDeparture.toISOString(),
                        numberOfNights: citiesNumberOfNightPairs[i].numberOfNights,
                        rate: findRate(cityArrival, cityDeparture, hotel.rates),
                        price: findTotalPrice(cityArrival, cityDeparture, hotel.rates, citiesNumberOfNightPairs[i].numberOfNights), // FIX THIS
                        currency: "EGP",
                    }
                    newAccomodationOffer.hotels.push(newHotel);

                });
                // sort hotels in each offer by price
                newAccomodationOffer.hotels.sort((a, b) => a.price > b.price ? 1 : -1);
                // limit number of hotels in each offer
                if (newAccomodationOffer.hotels.length > MAX_NUMBER_OF_HOTELS_PER_CITY) {
                    newAccomodationOffer.hotels = newAccomodationOffer.hotels.slice(0, MAX_NUMBER_OF_HOTELS_PER_CITY);
                }
                accomodationOffers.push(newAccomodationOffer);
            } catch (error) {
                console.log(error);
                reject(error);
            }
            arrivalMoment = cityDeparture; // move the arrival moment to the next city
        }
        resolve(accomodationOffers);
    })
};

function getHotelsOfCity(cityIata) {
    return new Promise(function (resolve, reject) {
        var cityHotelsUrl = MASTER_DATA_ENDPOINT + "/hotels/" + cityIata;

        httpRequest.get({ url: cityHotelsUrl, json: true }, function (error, response, hotels) {
            if (error) {
                reject(error);
            } else if (response.statusCode != 200) {
                reject(response.statusMessage);
            } else {
                resolve(hotels);
            }
        }
        );
    })
};

function getCityByIata(cityIata) {
    return new Promise(function (resolve, reject) {
        var cityUrl = MASTER_DATA_ENDPOINT + "/city/" + cityIata;

        httpRequest.get({ url: cityUrl, json: true }, function (error, response, city) {
            if (error) {
                reject(error);
            } else if (response.statusCode != 200) {
                reject(response.statusMessage);
            } else {
                resolve(city);
            }
        }
        );
    })
};

function findRate(cityArrival, cityDeparture, rates) {
    var arrivalMonth = cityArrival.format('MMM').toUpperCase(); // short name of the mongh
    var departureMonth = cityDeparture.format('MMM').toUpperCase(); // short name of the month

    var rateOfArrivalMonth = rates[arrivalMonth];
    var rateOfDepartureMonth = rates[departureMonth];
    return (rateOfArrivalMonth + rateOfDepartureMonth) / 2
}

function findTotalPrice(cityArrival, cityDeparture, rates, numberOfNights) {
    var nightRate = findRate(cityArrival, cityDeparture, rates);
    var totalPrice = nightRate * numberOfNights;
    return totalPrice;
}