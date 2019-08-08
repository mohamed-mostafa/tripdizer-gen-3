// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	apiUrl: 'https://development-services.tripdizer.com/',
	mixpanelToken: 'f78fd653e6b2cfe1d402f380ca08102f',
	experimentKey: '',
	saveRequestState: true,
	showSigningPopup: false,
	facebook: {
		appID: '1597597783733890',
		pixelID: null,
	},
	google: {
		OAuthID: '367695840720-sj3d2fuotd3gnnhtmi8g2iimobnmbnmt.apps.googleusercontent.com',
		analyticsTrackingID: 'UA-106443087-2',
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
