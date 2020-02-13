let httpRequest = require("request");
let moment = require("moment");

const TRAWEX_ADAPTER_ENDPOINT =
  process.env.TRAWEX_ADAPTER_ENDPOINT ||
  "http://localhost:8085/trawex-adapter/1.0.0";
const MASTER_DATA_ENDPOINT =
  process.env.MASTER_DATA_ENDPOINT || "http://localhost:8083/master-data";

const MEDIA_STORAGE_BASE_URL =
  process.env.MEDIA_STORAGE_BASE_URL ||
  "https://storage.cloud.google.com/tripdizer-dev.appspot.com";

const MAX_NUMBER_OF_HOTELS_PER_CITY = 9;

const ADULT = { type: "adult", age: 20 };
const KID = { type: "child", age: 5 };
const INFANT = { type: "child", age: 1 };

exports.searchAccomodations = function(language, accomomdationSearchRequest) {
  return new Promise(async (resolve, reject) => {
    const {
      arrival,
      budgetCategory,
      cities,
      numberOfAdults,
      numberOfChildren,
      numberOfInfants,
      desiredCostPerPerson
    } = accomomdationSearchRequest;

    const tripSegments = getTripSegments(arrival, cities);
    const rooms = getOrganizedRooms(
      numberOfAdults,
      numberOfChildren,
      numberOfInfants
    );
    const stars = getRangeOfStarsByBudgetCategory(budgetCategory);

    // create empty accomodation offers, one for each city in the trip
    var accomodationOffers = [];
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      var hotelCity = await getCityByIata(city.cityIata, language);
      if (!hotelCity) continue;
      var newAccomodationOffer = {
        city: {
          // here goes the city
          name: hotelCity.enName,
          displayName: language == "ar" ? hotelCity.arName : hotelCity.enName,
          iataCode: hotelCity.iataCode,
          country: hotelCity.countryEnName,
          countryDisplayName:
            language == "ar"
              ? hotelCity.countryArName
              : hotelCity.countryEnName,
          countryIsoCode: hotelCity.countryIsoCode,
          coordinates: hotelCity.lng + ", " + hotelCity.lat,
          thumbnail:
            MEDIA_STORAGE_BASE_URL + "/cities/" + hotelCity.iataCode + ".png",
          interests: hotelCity.interests.map(interest => interest.name)
        },
        hotels: []
      };
      accomodationOffers.push(newAccomodationOffer);
    }
    getHotelsOfMultipleCities(language, tripSegments, rooms, stars)
      .then(hotels => {
        // group the hotels into accomodation offers, one per city
        hotels.forEach(hotel => {
          var accomodationOffer = accomodationOffers.find(
            accomodationOffer => accomodationOffer.city.name == hotel.city
          );
          if (accomodationOffer) {
            accomodationOffer.hotels.push(hotel);
          }
        });
        resolve(accomodationOffers);
      })
      .catch(err => {
        console.error(
          "Failed to retrieve accomodation offers for: " +
            JSON.stringify(accomomdationSearchRequest)
        );
        console.error(err);
        reject(err);
      });
  });
};

const getHotelsOfMultipleCities = (
  language,
  tripSegments,
  rooms,
  stars,
  sortColumn = "price",
  limitPerCity = MAX_NUMBER_OF_HOTELS_PER_CITY,
  nationality = "EG",
  currency = "EGP"
) => {
  return new Promise(function(resolve, reject) {
    httpRequest.post(
      {
        url: TRAWEX_ADAPTER_ENDPOINT + "/hotels/search",
        json: true,
        body: {
          tripSegments,
          rooms,
          stars,
          sortColumn,
          limitPerCity,
          nationality,
          currency
        }
      },
      function(error, response, hotels) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else {
          resolve(
            hotels.map(h => ({
              id: h.id,
              name: h.name,
              displayName: h.name,
              description: h.facilities.join(", "),
              city: h.cityName,
              thumbnail: h.image,
              address: h.address,
              stars: h.stars,
              checkin: h.checkin,
              checkout: h.checkout,
              numberOfNights: moment(h.checkout).diff(h.checkin, "days"),
              rate: 0,
              price: h.price,
              currency: h.currency,
              moreDetails: h.moreDetails
            }))
          );
        }
      }
    );
  });
};

const getTripSegments = (arrival, cities) => {
  let tempDate = moment(arrival);
  return cities.map(city => {
    arrivalDate = moment(tempDate);
    leavingDate = moment(arrivalDate).add(city.numberOfNights, "days");
    tempDate = moment(leavingDate);
    return {
      cityName: city.cityName,
      countryName: city.countryName,
      arrivalDate: arrivalDate.format("YYYY-MM-DD"),
      leavingDate: leavingDate.format("YYYY-MM-DD")
    };
  });
};

const getOrganizedRooms = (adults, kids, infants) => {
  const adultsPerRoom = 2;
  const numberOfRooms = Math.ceil(adults / adultsPerRoom);
  const kidsPerRoom = Math.ceil(kids / numberOfRooms);
  const infantsPerRoom = Math.ceil(infants / numberOfRooms);

  const occupants = { adults, kids, infants };
  return Array.apply(null, Array(numberOfRooms)).map(() => {
    const room = [];
    const occupantsForCurrentRoom = {
      adults:
        occupants.adults > adultsPerRoom ? adultsPerRoom : occupants.adults,
      kids: occupants.kids > kidsPerRoom ? kidsPerRoom : occupants.kids,
      infants:
        occupants.infants > infantsPerRoom ? infantsPerRoom : occupants.infants
    };
    while (occupantsForCurrentRoom.adults-- && occupants.adults--)
      room.push(ADULT);
    while (occupantsForCurrentRoom.kids-- && occupants.kids--) room.push(KID);
    while (occupantsForCurrentRoom.infants-- && occupants.infants--)
      room.push(INFANT);
    return room;
  });
};

const getRangeOfStarsByBudgetCategory = budgetCategory => {
  switch (Number(budgetCategory)) {
    case 1:
      return [];
    case 2:
      return [1, 2];
    case 3:
      return [2, 3];
    case 4:
      return [3, 4];
    case 5:
      return [4, 5];
  }
};

function getCityByIata(cityIata, language) {
  return new Promise(function(resolve, reject) {
    var cityUrl = MASTER_DATA_ENDPOINT + "/city/" + cityIata;

    httpRequest.get(
      { url: cityUrl, json: true, qs: { lang: language } },
      function(error, response, city) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else {
          resolve(city);
        }
      }
    );
  });
}
