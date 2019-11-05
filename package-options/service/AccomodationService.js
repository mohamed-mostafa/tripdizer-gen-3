let httpRequest = require("request");
let moment = require("moment");

const MASTER_DATA_ENDPOINT =
  process.env.MASTER_DATA_ENDPOINT ||
  "http://localhost:8085/trawex-adapter/1.0.0";
const MAX_NUMBER_OF_HOTELS_PER_CITY = 9;

const ADULT = { type: "adult", age: 20 };
const KID = { type: "child", age: 5 };
const INFANT = { type: "child", age: 1 };

exports.searchAccomodations = function(language, accomomdationSearchRequest) {
  return new Promise((resolve, reject) => {
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

    getHotelsOfCity(language, tripSegments, rooms, stars)
      .then(hotels => {
        resolve(hotels);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getHotelsOfCity = (
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
        url: MASTER_DATA_ENDPOINT + "/hotels/search",
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
          resolve(hotels);
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
  switch (budgetCategory) {
    case 1 || "1":
      return [];
    case 2 || "2":
      return [1, 2];
    case 3 || "3":
      return [2, 3];
    case 4 || "4":
      return [3, 4];
    case 5 || "5":
      return [4, 5];
  }
};
