const httpRequest = require('request');

const TRAWEX_ADAPTER_ENDPOINT = process.env.TRAWEX_ADAPTER_ENDPOINT || 'http://35.242.174.95:8085/trawex-adapter/1.0.0';

let getFlightFareDetailsAPi = function(sessionId, fareSourceCode) {
	return new Promise(function(resolve, reject) {
		httpRequest.get(
			{
				url: TRAWEX_ADAPTER_ENDPOINT + '/flights/fare/details',
				json: true,
				qs: {
					sessionId,
					fareSourceCode,
				},
			},
			function(error, response, flights) {
				if (error) {
					reject(error);
				} else if (response.statusCode != 200) {
					reject(response.statusMessage);
				} else {
					resolve(flights);
				}
			}
		);
	});
};

let validateFlightAPi = function(sessionId, fareSourceCode) {
	return new Promise(function(resolve, reject) {
		httpRequest.get(
			{
				url: TRAWEX_ADAPTER_ENDPOINT + '/flights/fare/revalidate',
				json: true,
				qs: {
					sessionId,
					fareSourceCode,
				},
			},
			function(error, response, flights) {
				if (error) {
					reject(error);
				} else if (response.statusCode != 200) {
					console.log('code is not 200 in validate flights');

					reject(response.statusMessage);
				} else {
					console.log('success in flights');
					resolve(flights);
				}
			}
		);
	});
};

let checkHotelOffersAPi = function(data) {
	return new Promise(function(resolve, reject) {
		httpRequest.post(
			{
				url: TRAWEX_ADAPTER_ENDPOINT + '/hotels/offers',
				json: true,
				body: data,
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
let reValidateHotelAPi = function(data) {
	return new Promise(function(resolve, reject) {
		httpRequest.post(
			{
				url: TRAWEX_ADAPTER_ENDPOINT + '/hotels/revalidate',
				json: true,
				body: data,
			},
			function(error, response, hotels) {
				if (error) {
					reject(error);
				} else if (response.statusCode != 200) {
					console.log('code is not 200 in validate hotels');

					reject(response.statusMessage);
				} else {
					console.log('success in hotels');

					resolve(hotels);
				}
			}
		);
	});
};

module.exports = {
	getFlightFareDetailsAPi,
	validateFlightAPi,
	checkHotelOffersAPi,
	reValidateHotelAPi,
};
