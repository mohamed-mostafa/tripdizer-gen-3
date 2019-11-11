"use strict";

const httpRequest = require("request");

const TRAWEX_BASE_ENDPOINT =
  process.env.TRAWEX_BASE_ENDPOINT || "https://trawex.biz/api";
const TRAWEX_HOTELS_ROOT = "/hotel_trawexv5";
const TRAWEX_HOTELS_SEARCH = "/hotel_search";
const TRAWEX_HOTELS_MORE = "/getMoreHotels";
const TRAWEX_HOTELS_SPECIFIC_CONTENT = "/get_specific_hotel_content";
const TRAWEX_HOTELS_ROOM_RATES = "/get_room_rates";

const TRAWEX_USERNAME = process.env.TRAWEX_USERNAME || "TripdizerAPITest";
const TRAWEX_PASSWORD = process.env.TRAWEX_PASSWORD || "TripdizerAPI@2019";
const TRAWEX_SOURCE_IP_ADDRESS =
  process.env.TRAWEX_SOURCE_IP_ADDRESS || "34.90.113.143";
const TRAWEX_ENVIRONMENT = process.env.TRAWEX_ENVIRONMENT || "Test";
const TRAWEX_TRACKING_ID = process.env.TRAWEX_TRACKING_ID || "t83uqrhdf98ig";
const TRAWEX_PROXY_ENDPOINT =
  process.env.TRAWEX_PROXY_ENDPOINT || "http://35.242.174.95:3128";

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
        [cv.cityName]: cv.limit || hotelSearchRequest.limitPerCity
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

  return Promise.all(requestPromises).then(itineraries => {
    const selectedIitineraries = []
      .concat(...itineraries)
      .filter(i => !filters.stars.length || filters.stars.includes(+i.stars))
      .sort((i1, i2) => i1[filters.sortColumn] - i2[filters.sortColumn])
      .filter(
        i => filters.limits[i.cityName]-- > 0 || !filters.limits[i.cityName]
      );
    return selectedIitineraries;
  });
};

exports.getHotelDetails = (language, sessionId, productId, hotelId) => {
  return new Promise((resolve, reject) => {
    httpRequest.get(
      {
        url:
          TRAWEX_BASE_ENDPOINT +
          TRAWEX_HOTELS_ROOT +
          TRAWEX_HOTELS_SPECIFIC_CONTENT,
        proxy: TRAWEX_PROXY_ENDPOINT,
        json: true,
        qs: {
          user_id: TRAWEX_USERNAME,
          user_password: TRAWEX_PASSWORD,
          access: TRAWEX_ENVIRONMENT,
          ip_address: TRAWEX_SOURCE_IP_ADDRESS,
          trackingId: TRAWEX_TRACKING_ID,
          sessionId: sessionId,
          productId: productId,
          hotelId: hotelId
        }
      },
      (error, response, data) => {
        if (error) {
          reject({
            code: 500,
            message: [error.toString()]
          });
        } else if (response.statusCode != 200) {
          reject({
            code: response.statusCode,
            message: [response.statusMessage]
          });
        } else if (data.status && data.status.errors) {
          reject({
            code: 400,
            message: data.status.errors.map(e => e.errorMessage)
          });
        } else {
          resolve(data.hotels.length ? data.hotels[0] : {});
        }
      }
    );
  });
};

exports.getRoomRates = (language, roomRatesRequest) => {
  return new Promise((resolve, reject) => {
    httpRequest.post(
      {
        url:
          TRAWEX_BASE_ENDPOINT + TRAWEX_HOTELS_ROOT + TRAWEX_HOTELS_ROOM_RATES,
        proxy: TRAWEX_PROXY_ENDPOINT,
        json: true,
        body: {
          user_id: TRAWEX_USERNAME,
          user_password: TRAWEX_PASSWORD,
          access: TRAWEX_ENVIRONMENT,
          ip_address: TRAWEX_SOURCE_IP_ADDRESS,
          trackingId: TRAWEX_TRACKING_ID,
          TraceId: roomRatesRequest.traceId,
          propertyid: roomRatesRequest.propertyId,
          productId: roomRatesRequest.productId,
          TokenId: roomRatesRequest.tokenId,
          resultindex: roomRatesRequest.resultIndex,
          sessionId: roomRatesRequest.sessionId,
          hotelcode: roomRatesRequest.hotelId
        }
      },
      (error, response, data) => {
        if (error) {
          reject({
            code: 500,
            message: [error.toString()]
          });
        } else if (response.statusCode != 200) {
          reject({
            code: response.statusCode,
            message: [response.statusMessage]
          });
        } else if (data.status && data.status.errors) {
          reject({
            code: 400,
            message: data.status.errors.map(e => e.errorMessage)
          });
        } else if (!data.status && !data.isRateAvailable) {
          reject({
            code: 404,
            message: [data.errors.message]
          });
        } else {
          resolve(data.result);
        }
      }
    );
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
    const request = { city, country, checkin, checkout };
    httpRequest.get(
      {
        url: TRAWEX_BASE_ENDPOINT + TRAWEX_HOTELS_ROOT + TRAWEX_HOTELS_SEARCH,
        json: true,
        proxy: TRAWEX_PROXY_ENDPOINT,
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
          reject({
            code: 500,
            message: [error.toString()]
          });
        } else if (response.statusCode != 200) {
          reject({
            code: response.statusCode,
            message: [response.statusMessage]
          });
        } else if (data.status && data.status.errors) {
          reject({
            code: 400,
            message: data.status.errors.map(e => e.errorMessage)
          });
        } else {
          if (data.status.moreResults === "true") {
            getMoreHotelsAPI(
              request,
              data.status.sessionId,
              data.status.nextToken
            ).then(moreItineraries => {
              resolve([
                ...mapItineraryDetails(request, data),
                ...moreItineraries
              ]);
            });
          } else {
            resolve(mapItineraryDetails(request, data));
          }
        }
      }
    );
  });
};

const getMoreHotelsAPI = (originalReq, sessionId, nextToken) => {
  return new Promise((resolve, reject) => {
    httpRequest.get(
      {
        url: TRAWEX_BASE_ENDPOINT + TRAWEX_HOTELS_ROOT + TRAWEX_HOTELS_MORE,
        proxy: TRAWEX_PROXY_ENDPOINT,
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
          reject({
            code: 500,
            message: [error.toString()]
          });
        } else if (response.statusCode != 200) {
          reject({
            code: response.statusCode,
            message: [response.statusMessage]
          });
        } else if (data.status && data.status.errors) {
          reject({
            code: 400,
            message: data.status.errors.map(e => e.errorMessage)
          });
        } else {
          if (data.status.moreResults === "true") {
            getMoreHotelsAPI(
              originalReq,
              data.status.sessionId,
              data.status.nextToken
            ).then(moreItineraries => {
              resolve([
                ...mapItineraryDetails(originalReq, data),
                ...moreItineraries
              ]);
            });
          } else {
            resolve(mapItineraryDetails(originalReq, data));
          }
        }
      }
    );
  });
};

const mapItineraryDetails = (requestData, responseData) => {
  const { moreResults, nextToken, ...moreDetails } = responseData.status;
  return responseData.itineraries.map(i => ({
    address: i.hotelIAddress,
    checkin: requestData.checkin,
    checkout: requestData.checkout,
    cityName: requestData.city,
    countryName: requestData.country,
    currency: i.currency,
    image: i.image,
    latitude: Number(i.latitude),
    locality: i.locality,
    longitude: Number(i.longitude),
    name: i.hotelName,
    price: i.price,
    stars: Number(i.rating),
    facilities: i.facilities,
    moreDetails: {
      ...moreDetails,
      bookingToken: i.BookingToken,
      hotelId: i.hotelId,
      productId: i.productId,
      propertyId: i.propertyid,
      resultIndex: i.result_index,
      tokenId: i.TokenId,
      traceId: i.TraceId
    }
  }));
};
