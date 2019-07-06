let httpRequest = require('request');
let moment = require('moment');

const MASTER_DATA_ENDPOINT = process.env.MASTER_DATA_ENDPOINT || 'http://localhost:8083'

/**
 * retrieve options of accomodations for a package
 * By passing in the appropriate options, you can search for available hotels in the system
 *
 * language String 
 * accomomdationSearchRequest AccomomdationSearchRequest 
 * returns accomodationOffers
 **/
exports.searchAccomodations = function(language,accomomdationSearchRequest) {
    return new Promise(async function(resolve, reject) {
        var citiesNumberOfNightPairs = accomomdationSearchRequest.cities;
        var selectedBudgetCategory = accomomdationSearchRequest.budgetCategory;
        let arrivalMoment = new moment(accomomdationSearchRequest.arrival); // start moment

        var accomodationOffers = [];
        for (var i = 0; i < citiesNumberOfNightPairs.length; i++) {
            var cityIata = citiesNumberOfNightPairs[i].cityIata;
            var cityArrival = new moment(arrivalMoment); // arrivalMoment will be moved forward at the end of the loop
            var cityDeparture = new moment(arrivalMoment).add(citiesNumberOfNightPairs[i].numberOfNights, 'Days');

            try {
                var cityHotelsList = await getHotelsOfCity(cityIata);
                var city = await getCityByIata(cityIata);

                cityHotelsList.filter(hotel => hotel.budgetCategoryName.toLowerCase() == selectedBudgetCategory.toLowerCase()).forEach(hotel => {
                    var newAccomodationOffer = {
                        checkin: cityArrival.toString(),
                        checkout: cityDeparture.toString(),
                        numberOfNights: citiesNumberOfNightPairs[i].numberOfNights,
                        rate: 100, // FIX THIS
                        price: 100 * citiesNumberOfNightPairs[i].numberOfNights, // FIX THIS
                        currency: "EGP",
                        hotel: {
                            // here goes the hotel
                            name: hotel.enName,
                            displaName: language == 'ar' ? hotel.arName : hotel.enName,
                            description: language == 'ar' ? hotel.arDescription: hotel.enDescription,
                            thumbnail: hotel.thumbnail,
                            stars: hotel.stars
                        },
                        city: {
                            // here goes the city
                            displayName: language == 'ar' ? city.arName : city.enName,
                            iataCode: city.iataCode,
                            country: city.countryEnName,
                            countryDisplayName: language == 'ar' ? city.countryArName : city.countryEnName,
                            countryIsoCode: city.countryIsoCode,
                            coordinates: city.lng + ", " + city.lat,
                            thumbnail: city.thumbnail,
                            // interests: [] // FIX THIS
                        },
                        
                      }
                      accomodationOffers.push(newAccomodationOffer);
                });
                
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
    return new Promise(function(resolve, reject) {
        var cityHotelsUrl = MASTER_DATA_ENDPOINT + "/master-data/hotels/" + cityIata;

        httpRequest.get({url: cityHotelsUrl, json: true}, function(error, response, hotels) {
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
    return new Promise(function(resolve, reject) {
        var cityUrl = MASTER_DATA_ENDPOINT + "/master-data/city/" + cityIata;

        httpRequest.get({url: cityUrl, json: true}, function(error, response, city) {
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