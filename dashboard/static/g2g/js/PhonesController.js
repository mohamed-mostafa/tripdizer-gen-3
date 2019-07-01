g2gControlCenterApplication.controller('PhonesController', [
	'$rootScope',
	'$scope',
	'$http',
	'PhonesService',
	function($rootScope, $scope, $http, PhonesService) {
		// fields
		$scope.phones = [];
		$scope.loading = false;

		$scope.initialize = function() {
			PhonesService.getAll().then(function(phones) {
				$scope.phones = phones;
			});
		};
		$scope.initialize();

		$scope.savePhoneStatus = function(phoneId) {
			$scope.saving = true;
			for (let i = 0; i < $scope.phones.length; i++) {
				if ($scope.phones[i].Id === phoneId) {
					$http
						.put($rootScope.masterDataServerUrl + '/public/phone', { phone: $scope.phones[i] })
						.success(function(response) {
							$scope.saving = false;
							$scope.phones[i] = response;
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
