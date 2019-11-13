"use strict";

const httpRequest = require("request");
let moment = require("moment");

const TRAWEX_BASE_ENDPOINT =
  process.env.TRAWEX_BASE_ENDPOINT || "https://trawex.biz/api";
const TRAWEX_HOTELS_ROOT = "/hotel_trawexv5";
const TRAWEX_HOTELS_SEARCH = "/hotel_search";
const TRAWEX_HOTELS_MORE = "/getMoreHotels";
const TRAWEX_HOTELS_SPECIFIC_CONTENT = "/get_specific_hotel_content";
const TRAWEX_HOTELS_ROOM_RATES = "/get_room_rates";
const TRAWEX_HOTELS_BOOK = "/hotel_book";

const TRAWEX_USERNAME = process.env.TRAWEX_USERNAME || "TripdizerAPITest";
const TRAWEX_PASSWORD = process.env.TRAWEX_PASSWORD || "TripdizerAPI@2019";
const TRAWEX_SOURCE_IP_ADDRESS =
  process.env.TRAWEX_SOURCE_IP_ADDRESS || "34.90.113.143";
const TRAWEX_ENVIRONMENT = process.env.TRAWEX_ENVIRONMENT || "Test";
const TRAWEX_TRACKING_ID = process.env.TRAWEX_TRACKING_ID || "t83uqrhdf98ig";
const TRAWEX_PROXY_ENDPOINT =
  process.env.TRAWEX_PROXY_ENDPOINT || "http://35.242.174.95:3128";

const ADULT_AGE = 20;
const KID_AGE = 5;
const INFANT_AGE = 0;

exports.searchHotels = (language, hotelSearchRequest) => {
  const roomsInfo = {
    roomslength: hotelSearchRequest.rooms.length,
    adultsPerRoom: hotelSearchRequest.rooms.map(
      r => r.filter(o => isAdult(o.type)).length
    ),
    childsPerRoom: hotelSearchRequest.rooms.reduce(
      (pv, cv, i) => ({
        ...pv,
        [i]: cv.filter(o => isChild(o.type)).length
      }),
      {}
    ),
    childAges: hotelSearchRequest.rooms.reduce(
      (pv, cv, i) => ({
        ...pv,
        [i]: cv.filter(o => isChild(o.type)).map(o => o.age)
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

exports.getHotelOffers = (language, hotelOffersRequest) => {
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
          TraceId: hotelOffersRequest.traceId,
          propertyid: hotelOffersRequest.propertyId,
          productId: hotelOffersRequest.productId,
          TokenId: hotelOffersRequest.tokenId,
          resultindex: hotelOffersRequest.resultIndex,
          sessionId: hotelOffersRequest.sessionId,
          hotelcode: hotelOffersRequest.hotelId
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
          resolve(data.result.roomRate.perBookingRates.map(mapHotelOffer));
        }
      }
    );
  });
};

exports.bookHotel = (language, bookHotelRequest) => {
  const request = {
    sessionId: bookHotelRequest.sessionId,
    traceId: bookHotelRequest.traceId,
    tokenId: bookHotelRequest.tokenId,
    productId: bookHotelRequest.productId,
    hotelId: bookHotelRequest.hotelId,
    propertyId: bookHotelRequest.propertyId,
    resultIndex: bookHotelRequest.resultIndex,
    refCode: bookHotelRequest.refCode,
    preBookingToken: bookHotelRequest.preBookingToken,
    changedOccupancy: bookHotelRequest.changedOccupancy,
    extraBeds: bookHotelRequest.extraBeds,
    guestsDetails: {
      titles: bookHotelRequest.rooms.map(l =>
        l.filter(o => isAdult(o.ageGroup)).map(o => o.title)
      ),
      firstNames: bookHotelRequest.rooms.map(l =>
        l.filter(o => isAdult(o.ageGroup)).map(o => o.firstName)
      ),
      lastName: bookHotelRequest.rooms.map(l =>
        l.filter(o => isAdult(o.ageGroup)).map(o => o.lastName)
      ),
      childTitles: bookHotelRequest.rooms.map(l =>
        l.filter(o => isChild(o.ageGroup)).map(o => o.title)
      ),
      childFirstNames: bookHotelRequest.rooms.map(l =>
        l.filter(o => isChild(o.ageGroup)).map(o => o.firstName)
      ),
      childLastNames: bookHotelRequest.rooms.map(l =>
        l.filter(o => isChild(o.ageGroup)).map(o => o.lastName)
      ),
      city: bookHotelRequest.rooms[0][0].areaCode,
      email: bookHotelRequest.rooms[0][0].email,
      address: `${bookHotelRequest.rooms[0][0].areaCode} ${bookHotelRequest.rooms[0][0].countryCode}`,
      phone: bookHotelRequest.rooms[0][0].phone
    }
  };

  return bookHotel(language, request);
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

const bookHotel = (language, bookHotelRequest) => {
  return new Promise((resolve, reject) => {
    httpRequest.post(
      {
        url: TRAWEX_BASE_ENDPOINT + TRAWEX_HOTELS_ROOT + TRAWEX_HOTELS_BOOK,
        proxy: TRAWEX_PROXY_ENDPOINT,
        json: true,
        body: {
          user_id: TRAWEX_USERNAME,
          user_password: TRAWEX_PASSWORD,
          access: TRAWEX_ENVIRONMENT,
          ip_address: TRAWEX_SOURCE_IP_ADDRESS,
          trackingId: TRAWEX_TRACKING_ID,
          productId: bookHotelRequest.productId,
          hotelcode: bookHotelRequest.hotelId,
          propertyid: bookHotelRequest.propertyId,
          changedOccupancy: bookHotelRequest.changedOccupancy,
          extrabeds: bookHotelRequest.extraBeds,
          guests_details: {
            title: bookHotelRequest.guestsDetails.titles,
            first_name: bookHotelRequest.guestsDetails.firstNames,
            last_name: bookHotelRequest.guestsDetails.lastName,
            child_title: bookHotelRequest.guestsDetails.childTitles,
            child_first_name: bookHotelRequest.guestsDetails.childFirstNames,
            child_last_name: bookHotelRequest.guestsDetails.childLastNames,
            city: bookHotelRequest.guestsDetails.city,
            email: bookHotelRequest.guestsDetails.email,
            address: bookHotelRequest.guestsDetails.address,
            mobile_no: bookHotelRequest.guestsDetails.phone
          },
          refcode: bookHotelRequest.refCode,
          prebookingtoken: bookHotelRequest.preBookingToken,
          resultindex: bookHotelRequest.resultIndex,
          sessionId: bookHotelRequest.sessionId,
          TraceId: bookHotelRequest.traceId,
          TokenId: bookHotelRequest.tokenId
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
          resolve({
            bookingStatus: data.status,
            supplierConfirmationNum: data.supplierConfirmationNum,
            reference: data.reference,
            clientReference: data.clientReference,
            bookingDetails: data.booking
              ? {
                  ...data.booking.roomBookingDetails,
                  roomCount: data.booking.roomBookingDetails.room_count
                }
              : null
          });
        }
      }
    );
  });
};

const mapHotelOffer = room => ({
  allocationDetails: room.allocationDetails.split("|t|"),
  boardBasis: room.boardBasis,
  cancellationPolicies: room.cancellation_policy.split("|t|"),
  changedOccupancies: room.changedOccupancy.split("|t|"),
  codes: room.code.split("|t|"),
  currency: room.currency,
  description: room.desc,
  extraBeds: room.extrabeds,
  infoSource: room.infosource,
  inventoryType: room.inventoryType,
  mealCode: room.meal_code,
  onRequest: room.onRequest,
  productId: room.productId,
  rateBasisIds: room.rate_basis_id.split("|t|"),
  refundable: room.refundable,
  roomTypeRunnos: room.roomType_runno.split("|t|"),
  supplierHotelId: room.supplierHotelId,
  price: room.total,
  type: room.type
});

const isAdult = type => type === "adult";

const isChild = type => type === "kid" || type === "infant";
