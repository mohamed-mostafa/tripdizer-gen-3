var httpRequest = require('request');
var fs = require('fs');

const CURRENCY = 'EGP';
const WE_ACCEPT_PAYMENT_BASE_URL = 'https://accept.paymobsolutions.com/api/';
const WE_ACCEPT_PAYMENT_API_KEY =
	process.env.WE_ACCEPT_PAYMENT_API_KEY ||
	'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SndjbTltYVd4bFgzQnJJam95T0RRNExDSnVZVzFsSWpvaWFXNXBkR2xoYkNJc0ltTnNZWE56SWpvaVRXVnlZMmhoYm5RaWZRLnRRclNhZXpnMWtqbDd2MEx0alAxbWl4eFVXT3R4aHBOSDFkeDdFOWQzN3RaTjBNWGtrMmYzLTZBdlhrWmxBMHBLdTFEdzJ3UElqQmVwNEFzQnF6STlR';
const WE_ACCEPT_INTEGRATION_ID = process.env.WE_ACCEPT_INTEGRATION_ID || 4361;

var authenticate = (onSuccess, onFailure) => {
	httpRequest.post(
		{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}/auth/tokens`, json: true, body: { api_key: WE_ACCEPT_PAYMENT_API_KEY } },
		(error, response, data) => {
			if (!data || !data.token) onFailure('Authentication failed', error);
			else onSuccess({ merchantId: data.profile.id, authToken: data.token });
		}
	);
};

var registerRequestOrder = (request, onSuccess, onFailure) => {
	authenticate(({ merchantId, authToken }) => {
		const payload = {
			auth_token: authToken,
			delivery_needed: false,
			merchant_id: merchantId,
			amount_cents: request.estimatedCost,
			currency: CURRENCY,
			merchant_order_id: request.id,
		};
		httpRequest.post(
			{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}/ecommerce/orders`, json: true, body: payload },
			(error, response, data) => {
				if (!data || !data.id) onFailure('Order registration failed', error);
				else onSuccess({ authToken, orderId: data.id, amountCents: data.amount_cents, currency: data.currency });
			}
		);
	}, onFailure);
};

var registeredOrderAndGeneratePaymentKey = (request, onSuccess, onFailure) => {
	registerRequestOrder(
		request,
		({ authToken, orderId, amountCents, currency }) => {
			const payload = {
				auth_token: authToken,
				amount_cents: amountCents,
				expiration: 3600,
				order_id: orderId,
				currency: currency,
				integration_id: WE_ACCEPT_INTEGRATION_ID,
				lock_order_when_paid: false,
			};
			httpRequest.post(
				{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}/acceptance/payment_keys`, json: true, body: payload },
				(error, response, data) => {
					if (!data || !data.token) onFailure('Payment key generation failed', error);
					else onSuccess({ paymentKey: data.token });
				}
			);
		},
		onFailure
	);
};

var generatePaymentKeyWithoutRegistration = (request, onSuccess, onFailure) => {
	authenticate(({ authToken }) => {
		const payload = {
			auth_token: authToken,
			amount_cents: request.estimatedCost,
			currency: CURRENCY,
			integration_id: WE_ACCEPT_INTEGRATION_ID,
			order: { ...request, amount_cents: request.estimatedCost },
		};
		httpRequest.post(
			{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}/acceptance/payment_keys`, json: true, body: payload },
			(error, response, data) => {
				if (!data || !data.token) onFailure('Payment key generation failed', error);
				else onSuccess({ paymentKey: data.token });
			}
		);
	}, onFailure);
};

var notificationCallback = (type, payload, onSuccess, onFailure) => {
	fs.writeFile('notification_callback.json', JSON.stringify({ type, ...payload }), err => {
		console.log(err);
	});
	onSuccess('s');
};

var responseCallback = (payload, onSuccess, onFailure) => {
	console.log(payload);
	fs.writeFile('response_callback.json', JSON.stringify(payload), err => {
		console.log(err);
	});
	onSuccess('s');
};

var readFiles = (fileName, onSuccess, onFailure) => {
	fs.readFile('' + fileName + '.json', (err, data) => {
		console.log(data);
		onSuccess(data);
	});
};

exports.generatePaymentKeyWithoutRegistration = generatePaymentKeyWithoutRegistration;
exports.registeredOrderAndGeneratePaymentKey = registeredOrderAndGeneratePaymentKey;
exports.notificationCallback = notificationCallback;
exports.responseCallback = responseCallback;
exports.readFiles = readFiles;
