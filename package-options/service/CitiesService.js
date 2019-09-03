let httpRequest = require("request");
const MASTER_DATA_ENDPOINT =
  process.env.MASTER_DATA_ENDPOINT || "http://localhost:8083/master-data";
const MEDIA_STORAGE_BASE_URL =
  process.env.MEDIA_STORAGE_BASE_URL ||
  "https://storage.cloud.google.com/tripdizer-dev.appspot.com";
/**
 * retrieve options of cities for a package
 * retrieve the recommended options of cities in the countries choosen by the client, based on the client's interests
 *
 * language String
 * citiesSearchRequest CitiesSearchRequest
 * returns citiesList
 **/
exports.searchCities = function(language, citiesSearchRequest) {
  return new Promise(async function(resolve, reject) {
    var countriesList = citiesSearchRequest.countries;
    var citiesList = [];
    for (var i = 0; i < countriesList.length; i++) {
      var countryIsoCode = countriesList[i];
      try {
        var countryCitiesList = await getCitiesOfCountry(
          countryIsoCode,
          language
        );
        countryCitiesList.forEach(city => {
          var newCity = {
            name: city.enName,
            displayName: language == "ar" ? city.arName : city.enName,
            description:
              language == "ar" ? city.arDescription : city.enDescription,
            iataCode: city.iataCode,
            country: city.countryName,
            countryDisplayName:
              language == "ar" ? city.countryArName : city.countryEnName,
            countryIsoCode: city.countryIsoCode,
            coordinates: city.lat + ", " + city.lng,
            thumbnail:
              MEDIA_STORAGE_BASE_URL + "/cities/" + city.iataCode + ".png",
            interests: city.interests.map(interest => interest.name)
          };
          citiesList.push(newCity);
        });
      } catch (error) {
        reject(error);
      }
    }
    resolve(citiesList);
  });
};

function getCitiesOfCountry(countryIsoCode, language) {
  return new Promise(function(resolve, reject) {
    var countryCitiesUrl = MASTER_DATA_ENDPOINT + "/cities/" + countryIsoCode;
    httpRequest.get(
      { url: countryCitiesUrl, json: true, qs: { lang: language } },
      function(error, response, cities) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else {
          resolve(cities);
        }
      }
    );
  });
}
