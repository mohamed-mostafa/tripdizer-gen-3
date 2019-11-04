"use strict";

const httpRequest = require("request");

const TRAWEX_BASE_ENDPOINT = "https://trawex.biz/api";
const TRAWEX_HOTELS_ROOT = "/hotel_trawexv5";
const TRAWEX_HOTELS_SEARCH = "/hotel_search";
const TRAWEX_HOTELS_MORE = "/getMoreHotels";

const TRAWEX_USERNAME = process.env.TRAWEX_USERNAME || "TripdizerAPITest";
const TRAWEX_PASSWORD = process.env.TRAWEX_PASSWORD || "TripdizerAPI@2019";
const TRAWEX_SOURCE_IP_ADDRESS =
  process.env.TRAWEX_SOURCE_IP_ADDRESS || "34.90.113.143";
const TRAWEX_ENVIRONMENT = process.env.TRAWEX_ENVIRONMENT || "Test";
const TRAWEX_TRACKING_ID = process.env.TRAWEX_TRACKING_ID || "t83uqrhdf98ig";
const TRAWEX_PROXY_ENDPOINT =
  process.env.TRAWEX_PROXY_ENDPOINT || "http://34.90.113.143:3128";

exports.searchHotels = (language, hotelSearchRequest) => {
  const roomsInfo = {
    roomslength: hotelSearchRequest.rooms.length,
    adultsPerRoom: hotelSearchRequest.rooms.map(
      r => r.filter(o => o.type === "adult").length
    ),
    childsPerRoom: hotelSearchRequest.rooms.reduce(
      (pv, cv, i) => ({
        ...pv,
        [i]: cv.filter(o => o.type === "child").length
      }),
      {}
    ),
    childAges: hotelSearchRequest.rooms.reduce(
      (pv, cv, i) => ({
        ...pv,
        [i]: cv.filter(o => o.type === "child").map(o => o.age)
      }),
      {}
    )
  };
  const filters = {
    stars: hotelSearchRequest.stars || [],
    sortColumn: hotelSearchRequest.sortColumn || "price",
    limits: hotelSearchRequest.tripSegments.reduce(
      (pv, cv) => ({
        ...pv,
        [cv.cityName]: cv.limit || hotelSearchRequest.limitPerCity || 9
      }),
      {}
    )
  };

  const requestPromises = hotelSearchRequest.tripSegments.map(ts =>
    searchHotelsAPI(
      ts.cityName,
      ts.countryName,
      ts.arrivalDate,
      ts.leavingDate,

      roomsInfo.roomslength,
      roomsInfo.adultsPerRoom,
      roomsInfo.childsPerRoom,
      roomsInfo.childAges,

      hotelSearchRequest.nationality,
      hotelSearchRequest.currency
    )
  );

  return Promise.all(requestPromises)
    .then(itineraries => {
      return []
        .concat(...itineraries)
        .filter(i => !filters.stars.length || filters.stars.includes(+i.rating))
        .sort((i1, i2) => i1[filters.sortColumn] - i2[filters.sortColumn])
        .filter(
          i => filters.limits[i.cityName]-- > 0 || !filters.limits[i.cityName]
        )
        .map(i => ({
          name: i.hotelName,
          displaName: i.hotelName,
          thumbnail: i.image,
          stars: i.rating,
          price: i.price,
          currency: i.currency,
          cityName: i.cityName,
          countryName: i.countryName,
          address: i.hotelIAddress,
          latitude: i.latitude,
          longitude: i.longitude,
          facilities: i.facilities
        }));
    })
    .catch(err => {
      return err;
    });
};

const searchHotelsAPI = (
  city,
  country,
  checkin,
  checkout,
  room_count,
  adult,
  child,
  child_age,
  nationality = "EG",
  currency = "EGP"
) => {
  return new Promise((resolve, reject) => {
    httpRequest.get(
      {
        url: TRAWEX_BASE_ENDPOINT + TRAWEX_HOTELS_ROOT + TRAWEX_HOTELS_SEARCH,
        json: true,
        body: {
          user_id: TRAWEX_USERNAME,
          user_password: TRAWEX_PASSWORD,
          access: TRAWEX_ENVIRONMENT,
          ip_address: TRAWEX_SOURCE_IP_ADDRESS,
          trackingId: TRAWEX_TRACKING_ID,
          city_name: city,
          country_name: country,
          room_count: room_count,
          adult: adult,
          child: child,
          child_age: child_age,
          checkin: checkin,
          checkout: checkout,
          client_nationality: nationality,
          requiredCurrency: currency
        }
      },
      (error, response, data) => {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else if (data.status.errors) {
          reject(data.status.errors.map(e => e.errorMessage));
        } else {
          if (data.status.moreResults === "true") {
            getMoreHotelsAPI(data.status.sessionId, data.status.nextToken)
              .then(moreItineraries => {
                resolve(
                  [...data.itineraries, ...moreItineraries].map(i => ({
                    ...i,
                    cityName: city,
                    countryName: country
                  }))
                );
              })
              .catch(err => reject(err));
          } else {
            resolve(
              data.itineraries.map(i => ({
                ...i,
                cityName: city,
                countryName: country
              }))
            );
          }
        }
      }
    );
  });
};

const getMoreHotelsAPI = (sessionId, nextToken) => {
  return new Promise((resolve, reject) => {
    httpRequest.get(
      {
        url: TRAWEX_BASE_ENDPOINT + TRAWEX_HOTELS_ROOT + TRAWEX_HOTELS_MORE,
        json: true,
        qs: {
          user_id: TRAWEX_USERNAME,
          user_password: TRAWEX_PASSWORD,
          access: TRAWEX_ENVIRONMENT,
          ip_address: TRAWEX_SOURCE_IP_ADDRESS,
          trackingId: TRAWEX_TRACKING_ID,
          sessionId: sessionId,
          nextToken: nextToken
        }
      },
      (error, response, data) => {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else if (data.status.errors) {
          reject(data.status.errors.map(e => e.errorMessage));
        } else {
          if (data.status.moreResults === "true") {
            getMoreHotelsAPI(data.status.sessionId, data.status.nextToken).then(
              otherData => {
                resolve([...data.itineraries, ...otherData.itineraries]);
              }
            );
          } else {
            resolve(data.itineraries);
          }
        }
      }
    );
  });
};
