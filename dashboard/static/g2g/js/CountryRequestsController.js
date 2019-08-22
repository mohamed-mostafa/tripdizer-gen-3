g2gControlCenterApplication.controller('CountryRequestsController', [
	'$rootScope',
	'$scope',
	'$http',
	'CountryRequestsService',
	function($rootScope, $scope, $http, CountryRequestsService) {
		// fields
		$scope.CountryRequests = [];
		$scope.loading = false;

		$scope.initialize = function() {
			CountryRequestsService.getAll().then(function(CountryRequests) {
				$scope.CountryRequests = CountryRequests;
			});
		};
		$scope.initialize();

		$scope.saveCountryRequestStatus = function(countryRequestId) {
			$scope.saving = true;
			for (let i = 0; i < $scope.CountryRequests.length; i++) {
				if ($scope.countryRequests[i].Id === countryRequestId) {
					$http
						.put($rootScope.masterDataServerUrl + '/public/country-request', { countryRequest: $scope.countryRequests[i] })
						.success(function(response) {
							$scope.saving = false;
							$scope.countryRequests[i] = response;
						})
						.error(function(err) {
							$scope.saving = false;
							$scope.serverError = true;
							$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
						});
				}
			}
		};
	},
]);
