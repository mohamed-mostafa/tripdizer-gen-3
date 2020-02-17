var httpRequest = require('request');
let paymentsDao = require('../dataaccess/hws_payments_dao');
var requestBusiness = require('../business/hws_requests_business');

const CURRENCY = 'EGP';
const WE_ACCEPT_PAYMENT_BASE_URL = 'https://accept.paymobsolutions.com/api/';
const WE_ACCEPT_PAYMENT_API_KEY =
	process.env.WE_ACCEPT_PAYMENT_API_KEY ||
	'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SndjbTltYVd4bFgzQnJJam95T0RRNExDSnVZVzFsSWpvaWFXNXBkR2xoYkNJc0ltTnNZWE56SWpvaVRXVnlZMmhoYm5RaWZRLnRRclNhZXpnMWtqbDd2MEx0alAxbWl4eFVXT3R4aHBOSDFkeDdFOWQzN3RaTjBNWGtrMmYzLTZBdlhrWmxBMHBLdTFEdzJ3UElqQmVwNEFzQnF6STlR';
const WE_ACCEPT_CC_INTEGRATION_ID = process.env.WE_ACCEPT_CC_INTEGRATION_ID || 4361;
const WE_ACCEPT_valU_INTEGRATION_ID = process.env.WE_ACCEPT_valU_INTEGRATION_ID || 7644;
const BASE_MERCHANT_ID = process.env.BASE_MERCHANT_ID || 3000000;

var authenticate = (onSuccess, onFailure) => {
	httpRequest.post(
		{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}auth/tokens`, json: true, body: { api_key: WE_ACCEPT_PAYMENT_API_KEY } },
		(error, response, data) => {
			if (!data || !data.token)
				onFailure({
					message: 'Authentication failed.',
					error: JSON.stringify(error || data),
				});
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
			amount_cents: request.estimatedCost * 100, // cost in the request is in EGP, gateway requires cost in cents (1 EGP = 100 piasters)
			currency: CURRENCY,
			merchant_order_id: request.id + BASE_MERCHANT_ID,
		};
		httpRequest.post(
			{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}ecommerce/orders`, json: true, body: payload },
			(error, response, data) => {
				if (!data || !data.id)
					onFailure({
						message: 'Order registration failed.',
						error: JSON.stringify(error || data),
					});
				else onSuccess({ authToken, orderId: data.id, amountCents: data.amount_cents, currency: data.currency });
			}
		);
	}, onFailure);
};

var generatePaymentKeyWithOrderRegistration = (isCash, request, onSuccess, onFailure) => {
	registerRequestOrder(
		request,
		({ authToken, orderId, amountCents, currency }) => {
			const payload = {
				auth_token: authToken,
				amount_cents: amountCents,
				expiration: 3600,
				order_id: orderId,
				currency: currency,
				integration_id: isCash ? WE_ACCEPT_CC_INTEGRATION_ID : WE_ACCEPT_valU_INTEGRATION_ID,
				billing_data: {
					first_name: request.pnrInfoList[0].firstName,
					last_name: request.pnrInfoList[0].lastName,
					phone_number: request.pnrInfoList[0].phone,
					email: request.pnrInfoList[0].email,
					country: request.pnrInfoList[0].nationality,
					apartment: '0',
					floor: '0',
					building: 'N/A',
					street: 'N/A',
					postal_code: 'N/A',
					city: 'N/A',
					state: 'N/A',
					shipping_method: 'PKG',
				},
			};
			httpRequest.post(
				{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}acceptance/payment_keys`, json: true, body: payload },
				(error, response, data) => {
					if (!data || !data.token)
						onFailure({
							message: 'Payment key generation failed.',
							error: JSON.stringify(error || data),
						});
					else onSuccess({ paymentKey: data.token });
				}
			);
		},
		onFailure
	);
};

var generatePaymentKeyWithoutOrderRegistration = (isCash, request, onSuccess, onFailure) => {
	authenticate(({ authToken }) => {
		const payload = {
			auth_token: authToken,
			amount_cents: request.estimatedCost * 100,
			currency: CURRENCY,
			integration_id: isCash ? WE_ACCEPT_CC_INTEGRATION_ID : WE_ACCEPT_valU_INTEGRATION_ID,
			order: { ...request, amount_cents: request.estimatedCost * 100 },
		};
		httpRequest.post(
			{ url: `${WE_ACCEPT_PAYMENT_BASE_URL}acceptance/payment_keys`, json: true, body: payload },
			(error, response, data) => {
				if (!data || !data.token)
					onFailure({
						message: 'Payment key generation failed.',
						error: JSON.stringify(error || data),
					});
				else onSuccess({ paymentKey: data.token });
			}
		);
	}, onFailure);
};

var notificationCallback = (type, payload, onSuccess, onFailure) => {
	paymentsDao.save(payload.order.merchant_order_id, type, payload.created_at, payload);
	if (type === 'TRANSACTION' && payload.success) {
		requestBusiness.handlePaidRequest(payload.order.merchant_order_id);
	} else {
		console.error('Recieved failed payment callback');
	}
	onSuccess();
};

var responseCallback = (payload, onSuccess, onFailure) => {
	onSuccess(payload['data.message']);
};

exports.generatePaymentKeyWithoutOrderRegistration = generatePaymentKeyWithoutOrderRegistration;
exports.generatePaymentKeyWithOrderRegistration = generatePaymentKeyWithOrderRegistration;
exports.notificationCallback = notificationCallback;
exports.responseCallback = responseCallback;
