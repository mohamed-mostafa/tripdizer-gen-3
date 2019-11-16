// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	apiUrl: 'https://development-services.tripdizer.com/',
	// apiUrl: 'http://localhost:8080/',
	mixpanelToken: 'f78fd653e6b2cfe1d402f380ca08102f',
	experimentKey: '',
	saveRequestState: true,
	showSigningPopup: false,
	facebook: {
		appID: '734243320376855',
		// appID: '987129541621584',
		pixelID: null,
	},
	google: {
		OAuthID: '1004287460562-o43geqvk6s63rteosdftluhkpiq1kid4.apps.googleusercontent.com',
		// OAuthID: '121939121166-01m8e12acch3s3pjpkknh3obkmpl8l97.apps.googleusercontent.com',
		analyticsTrackingID: 'UA-106443087-2',
		conversionTrackingId: '',
		conversionTrackingTarget: '',
		apiKey: 'AIzaSyCAw8gPVklDhcSGTiV8HdSVFqWK_ysEAyg',
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
