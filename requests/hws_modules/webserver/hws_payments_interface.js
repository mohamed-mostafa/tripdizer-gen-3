var paymentsBusiness = require('../business/hws_payments_business');

var notificationCallback = function(req, res) {
	try {
		var type = req.body.type;
		var payload = req.body.obj;
		paymentsBusiness.notificationCallback(
			type,
			payload,
			data => res.sendStatus(204),
			() =>
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.")
		);
	} catch (error) {
		console.error('An error occurred in /payments/notification-callback');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var responseCallback = function(req, res) {
	try {
		var queryParams = req.query;
		paymentsBusiness.responseCallback(
			queryParams,
			data => res.send(data),
			() =>
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.")
		);
	} catch (error) {
		console.error('An error occurred in /payments/response-callback');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.notificationCallback = notificationCallback;
exports.responseCallback = responseCallback;
