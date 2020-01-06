g2gControlCenterApplication.controller('PaymentsController', [
	'$rootScope',
	'$scope',
	'$http',
	function($rootScope, $scope, $http) {
		// fields
		$scope.amount = 1000;
		$scope.paymentKey = '';
		$scope.loading = false;

		$scope.getPaymentKey = function() {
			$scope.paymentKey = '';
			if ($scope.amount) {
				$scope.loading = true;
				$http
					.get($rootScope.requestsServerUrl + '/payments/key/' + $scope.amount)
					.success(function(response) {
						$scope.loading = false;
						$scope.paymentKey = response.paymentKey;
					})
					.error(function(err) {
						$scope.loading = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
					});
			}
		};
	},
]);
