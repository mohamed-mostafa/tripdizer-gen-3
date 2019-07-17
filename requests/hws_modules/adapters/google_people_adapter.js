'use strict';

// for information about how to do account delegation (to login using a gcloud service account that impersonates a g-suite account)
// check https://stackoverflow.com/questions/37243862/send-mail-via-google-apps-gmail-using-service-account-domain-wide-delegation-in

const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

const key = require('../../tripdizer-service-account-key.json'); // this is the one that has been whitelisted at gsuite for google contacts
const scopes = 'https://www.googleapis.com/auth/contacts';
const jwt = new google.auth.JWT(
	key.client_email,
	null,
	key.private_key,
	scopes,
	process.env.GOOGLE_PEOPLE_CONTACTS_ACCOUNT || 'test@tripdizer.com'
);

var authorizeAndCreateNewContact = function(emailAddress, name, phone, requestId) {
	jwt.authorize((err, response) => {
		if (err) {
			console.log('Authentication to google apis failed');
			console.log(err);
		} else {
			createNewContact(jwt, emailAddress, name, phone, requestId);
		}
	});
};

var createNewContact = function(auth, emailAddress, name, phone, requestId) {
	const service = google.people({ version: 'v1', auth });
	service.people.createContact(
		{
			requestBody: {
				emailAddresses: [{ value: emailAddress }],
				phoneNumbers: [{ value: phone, type: 'main' }],
				names: [{ givenName: requestId, familyName: name }],
			},
		},
		(err, res) => {
			if (err) return console.error('The google people API returned an error: ' + err);
			else {
				console.log('Contact ' + name + ' created in google people successfully');
			}
		}
	);
};

var listConnectionNames = function(auth) {
	const service = google.people({ version: 'v1', auth });
	service.people.connections.list(
		{
			resourceName: 'people/me',
			pageSize: 10,
			personFields: 'names,emailAddresses',
		},
		(err, res) => {
			if (err) return console.error('The API returned an error: ' + err);
			const connections = res.data.connections;
			if (connections) {
				console.log('Connections:');
				connections.forEach(person => {
					if (person.names && person.names.length > 0) {
						console.log(person.names[0].displayName);
					} else {
						console.log('No display name found for connection.');
					}
				});
			} else {
				console.log('No connections found.');
			}
		}
	);
};

exports.createNewContact = authorizeAndCreateNewContact;
