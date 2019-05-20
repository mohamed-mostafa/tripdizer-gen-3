// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	apiUrl: 'http://localhost:8080/',
	googleAnalyticsTrackingID: 'UA-106443087-2',
	facebookPixelID: null,
	mixpanelToken: 'f78fd653e6b2cfe1d402f380ca08102f',
	experimentKey: '',
	facebook: {
		appID: '692219684549236',
	},
	google: {
		OAuthID: '181173581443-lmlkmu06abauaed1oauqgdcn87gbhbaa.apps.googleusercontent.com',
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
