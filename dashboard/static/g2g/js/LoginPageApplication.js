/**
 * 
 */
var g2gControlCenterApplication = angular.module("G2GControlCenterApplication", [])
	.run(function ($rootScope) {
		// $rootScope.serverURL = 'http://localhost:8080'; // local backend server
		$rootScope.serverURL = 'https://tripdizer-backend-dot-tripdizer-stg.appspot.com'; // remote backend server
	})
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(false);
		//    $locationProvider.html5Mode(true);
	}]);