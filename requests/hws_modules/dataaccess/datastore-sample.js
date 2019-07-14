let transportationDao = require('../dataaccess/hws_request_transporation_dao');
let accomodationDao = require('../dataaccess/hws_request_accomodation_dao');
let attractionsDao = require('../dataaccess/hws_request_attractions_dao');
let citiesDao = require('../dataaccess/hws_request_cities_dao');

citiesDao.save(5618, {choices:[
	{
	  "name": "Amsterdam",
	  "displayName": "Amsterdam",
	  "description": "Amsterdam",
	  "iataCode": "AMS",
	  "countryDisplayName": "Holland",
	  "countryIsoCode": "NLD",
	  "coordinates": "0, 0",
	  "thumbnail": "0",
	  "interests": []
	},
	{
	  "name": "Rome",
	  "displayName": "Rome",
	  "description": "Rome",
	  "iataCode": "FCO",
	  "countryDisplayName": "Italy",
	  "countryIsoCode": "ITA",
	  "coordinates": "0, 0",
	  "thumbnail": "0",
	  "interests": []
	},
	{
	  "name": "Florence",
	  "displayName": "Florence",
	  "description": "Florence",
	  "iataCode": "FLR",
	  "countryDisplayName": "Italy",
	  "countryIsoCode": "ITA",
	  "coordinates": "0, 0",
	  "thumbnail": "0",
	  "interests": []
	},
	{
	  "name": "Paris",
	  "displayName": "Paris",
	  "description": "Paris",
	  "iataCode": "CDG",
	  "countryDisplayName": "France",
	  "countryIsoCode": "FRA",
	  "coordinates": "0, 0",
	  "thumbnail": "0",
	  "interests": []
	}
  ]});

  transportationDao.save(5618, {choices:[
	{
	  "price": "3579.00",
	  "currency": "EGP",
	  "segments": [
		{
		  "origin": "CAI",
		  "destination": "ATH",
		  "departure": "2019-10-20T09:20:00+02:00",
		  "return": "2019-10-20T12:20:00+03:00",
		  "durationInWords": "2 h",
		  "durationInMinutes": 120
		},
		{
		  "origin": "ATH",
		  "destination": "AMS",
		  "departure": "2019-10-20T13:15:00+03:00",
		  "return": "2019-10-20T15:45:00+02:00",
		  "durationInWords": "3 h, 30 m",
		  "durationInMinutes": 210
		}
	  ],
	  "carrier": {
		"iataCode": "A3",
		"name": "AEGEAN AIRLINES",
		"squareLogo": "https://www.gstatic.com/flights/airline_logos/70px/A3.png",
		"wideLogo": "https://www.skyscanner.net/images/airlines/small/A3.png"
	  }
	},
	{
	  "price": "1606.00",
	  "currency": "EGP",
	  "segments": [
		{
		  "origin": "CDG",
		  "destination": "FLR",
		  "departure": "2019-10-26T20:50:00+02:00",
		  "return": "2019-10-26T22:35:00+02:00",
		  "durationInWords": "1 h, 45 m",
		  "durationInMinutes": 105
		}
	  ],
	  "carrier": {
		"iataCode": "AF",
		"name": "AIR FRANCE",
		"squareLogo": "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
		"wideLogo": "https://www.skyscanner.net/images/airlines/small/AF.png"
	  }
	}
  
  ]});

  attractionsDao.save(5618, {choices:[
    {
      "city": {
        "name": "Amsterdam",
        "displayName": "Amsterdam",
        "iataCode": "AMS",
        "country": "Holland",
        "countryDisplayName": "Holland",
        "countryIsoCode": "NLD",
        "coordinates": "0, 0",
        "thumbnail": "0"
      },
      "attractions": [
        {
          "name": "Vondel Park",
          "description": "Biggest park in Amsterdam",
          "category": "Enjoy a park",
          "thumbnail": "123, 456"
        },
        {
          "name": "Heineken Experience",
          "description": "Enjoy the heineken experience",
          "category": "Visit one of Amsterdam's historic sites",
          "thumbnail": "123, 456"
        },
        {
          "name": "Iamstram Sign",
          "description": "The famous sign of Iamstrdam",
          "category": "Visit an iconic square",
          "thumbnail": "123, 456"
        }
      ]
    },
    {
      "city": {
        "name": "Paris",
        "displayName": "Paris",
        "iataCode": "CDG",
        "country": "France",
        "countryDisplayName": "France",
        "countryIsoCode": "FRA",
        "coordinates": "0, 0",
        "thumbnail": "0"
      },
      "attractions": [
        {
          "name": "Tour Eiffel",
          "description": "Visit the iconic tour eiffel",
          "category": "Historic Site Visit",
          "thumbnail": "123, 456"
        },
        {
          "name": "Champs Elysee",
          "description": "Enjoy the champs elysee street",
          "category": "Visit a shopping site",
          "thumbnail": "123, 456"
        }
      ]
    },
    {
      "city": {
        "name": "Florence",
        "displayName": "Florence",
        "iataCode": "FLR",
        "country": "Italy",
        "countryDisplayName": "Italy",
        "countryIsoCode": "ITA",
        "coordinates": "0, 0",
        "thumbnail": "0"
      },
      "attractions": [
        {
          "name": "Michael Angelo Square",
          "description": "Enjoy the view over the city",
          "category": "Visit an artistic site",
          "thumbnail": "123, 456"
        }
      ]
    },
    {
      "city": {
        "name": "Rome",
        "displayName": "Rome",
        "iataCode": "FCO",
        "country": "Italy",
        "countryDisplayName": "Italy",
        "countryIsoCode": "ITA",
        "coordinates": "0, 0",
        "thumbnail": "0"
      },
      "attractions": [
        {
          "name": "Trevi Fountain",
          "description": "Enjoy the lucky fountain",
          "category": "Visit a historic site",
          "thumbnail": "123, 456"
        },
        {
          "name": "Vatican City",
          "description": "Enjoy the historic city",
          "category": "Visit a religious site",
          "thumbnail": "123, 456"
        }
      ]
    }
  ]});

  accomodationDao.save(5618, {choices: [
    {
        "name": "Best Western Le 18 Paris",
        "displaName": "Best Western Le 18 Paris",
        "description": "Best Western Le 18 Paris is one of the best hotels in the city",
        "thumbnail": null,
        "address": "10 Main St.",
        "stars": 3,
        "checkin": "Tue Oct 22 2019 00:00:00 GMT+0200",
        "checkout": "Fri Oct 25 2019 00:00:00 GMT+0200",
        "numberOfNights": 3,
        "rate": 1679,
        "price": 5037,
        "currency": "EGP"
      },
      {
        "name": "easy Hotel Amsterdam Zaandam",
        "displaName": "easy Hotel Amsterdam Zaandam",
        "description": "easy Hotel Amsterdam Zaandam is one of the best hotels in the city",
        "thumbnail": null,
        "address": "10 Main St.",
        "stars": 1,
        "checkin": "Sun Oct 20 2019 00:00:00 GMT+0200",
        "checkout": "Tue Oct 22 2019 00:00:00 GMT+0200",
        "numberOfNights": 2,
        "rate": 1646,
        "price": 3292,
        "currency": "EGP"
      }
  ]})