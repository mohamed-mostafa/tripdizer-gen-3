const crypto = require('crypto');
const paymentsBusiness = require('../business/hws_payments_business');

const WE_ACCEPT_HMAC_KEY = process.env.WE_ACCEPT_HMAC_KEY || '09C1F04FCDF328E2184BF25B87F78A3C';

var notificationCallback = function(req, res) {
	try {
		var type = req.body.type;
		var payload = req.body.obj;
		if (getCalculatedHmac(flatten(payload)) !== req.query.hmac) {
			res.sendStatus(401);
		} else {
			paymentsBusiness.notificationCallback(
				type,
				payload,
				data => res.sendStatus(204),
				() =>
					res
						.status(500)
						.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.")
			);
		}
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
		if (getCalculatedHmac(queryParams) !== req.query.hmac) {
			res.sendStatus(401);
		} else {
			paymentsBusiness.responseCallback(
				queryParams,
				data => res.send(data),
				() =>
					res
						.status(500)
						.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.")
			);
		}
	} catch (error) {
		console.error('An error occurred in /payments/response-callback');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getCalculatedHmac = data => {
	const value = [
		'amount_cents',
		'created_at',
		'currency',
		'error_occured',
		'has_parent_transaction',
		'id',
		'integration_id',
		'is_3d_secure',
		'is_auth',
		'is_capture',
		'is_refunded',
		'is_standalone_payment',
		'is_voided',
		'order',
		'order.id',
		'owner',
		'pending',
		'source_data.pan',
		'source_data.sub_type',
		'source_data.type',
		'success',
	]
		.sort((a, b) => a.localeCompare(b))
		.map(key => data[key])
		.join('');

	const hmacValue = crypto
		.createHmac('SHA512', WE_ACCEPT_HMAC_KEY)
		.update(value)
		.digest('hex');
	return hmacValue;
};

const flatten = (obj, includePrototype, into, prefix) => {
	into = into || {};
	prefix = prefix || '';

	for (var k in obj) {
		if (includePrototype || obj.hasOwnProperty(k)) {
			var prop = obj[k];
			if (prop && typeof prop === 'object' && !(prop instanceof Date || prop instanceof RegExp)) {
				flatten(prop, includePrototype, into, prefix + k + '.');
			} else {
				into[prefix + k] = prop;
			}
		}
	}

	return into;
};

exports.notificationCallback = notificationCallback;
exports.responseCallback = responseCallback;
