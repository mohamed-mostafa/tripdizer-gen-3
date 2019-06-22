/**
 *
 */
var g2gControlCenterApplication = angular
	.module('G2GControlCenterApplication', [])
	.run(function($rootScope) {
		$rootScope.serverURL = globalVariables.serverURL;
		$rootScope.requestsServerUrl = globalVariables.serverURL + '/requests';
		$rootScope.masterDataServerUrl = globalVariables.serverURL + '/master-data';
	})
	.config([
		'$locationProvider',
		function($locationProvider) {
			$locationProvider.html5Mode(false);
			//    $locationProvider.html5Mode(true);
		},
	]);
