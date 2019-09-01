let httpRequest = require('request');

const MASTER_DATA_ENDPOINT = process.env.MASTER_DATA_ENDPOINT || 'http://localhost:8083/master-data'
const MEDIA_STORAGE_BASE_URL = process.env.MEDIA_STORAGE_BASE_URL || 'https://storage.cloud.google.com/tripdizer-dev.appspot.com';
/**
 * retrieve options of activities of a city for a package
 * By passing in the appropriate options, you can search for available activities in the system 
 *
 * language String 
 * attractionsSearchRequest AttractionsSearchRequest the client's choosen cities IATA codes
 * returns attractionOffers
 **/
exports.searchAttractions = function (language, attractionsSearchRequest) {
    return new Promise(async function (resolve, reject) {
        var citiesNumberOfNightPairs = attractionsSearchRequest.cities;
        var interests = attractionsSearchRequest.interests; // to be used later to filter the attractions

        var attractionOffers = [];
        for (var i = 0; i < citiesNumberOfNightPairs.length; i++) {
            var cityIata = citiesNumberOfNightPairs[i].cityIata;
            var cityNumberOfNights = citiesNumberOfNightPairs[i].numberOfNights;
            try {
                // create attractions offer for each city
                var city = await getCityByIata(cityIata);
                if (!city) continue;
                var newAttractionOffer = {
                    city: {
                        // here goes the city
                        name: city.enName,
                        arName: city.arName,
                        iataCode: city.iataCode,
                        country: city.countryEnName,
                        countryArName: city.countryArName,
                        countryIsoCode: city.countryIsoCode,
                        coordinates: city.lng + ", " + city.lat,
                        thumbnail: MEDIA_STORAGE_BASE_URL + "/cities/" + city.iataCode + ".png",
                        interests: city.interests.map(interest => interest.name)
                    },
                    attractions: []
                }

                // add attraction to the city offers attractions
                var cityAttractionsList = await getAttractionsOfCity(cityIata);

                if (cityAttractionsList.length > cityNumberOfNights) {
                    cityAttractionsList = cityAttractionsList.slice(0, cityNumberOfNights);
                }
                cityAttractionsList.forEach(attraction => {
                    var newAttraction = {
                        name: attraction.enName,
                        arName: attraction.arName,
                        description: attraction.enDescription,
                        arDescription: attraction.arDescription,
                        category: attraction.enCategory,
                        arCategory: attraction.arCategory
                        // thumbnail: attraction.thumbnail
                    }
                    newAttractionOffer.attractions.push(newAttraction);
                });
                attractionOffers.push(newAttractionOffer);

            } catch (error) {
                console.error(error);
                reject(error);
            }
        }
        resolve(attractionOffers);
    })
};

function getAttractionsOfCity(cityIata) {
    return new Promise(function (resolve, reject) {
        var cityAttractionsUrl = MASTER_DATA_ENDPOINT + "/attractions/" + cityIata;

        httpRequest.get({ url: cityAttractionsUrl, json: true }, function (error, response, attractions) {
            if (error) {
                reject(error);
            } else if (response.statusCode != 200) {
                reject(response.statusMessage);
            } else {
                resolve(attractions);
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

