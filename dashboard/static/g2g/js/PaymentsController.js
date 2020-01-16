g2gControlCenterApplication.controller('PaymentsController', [
	'$rootScope',
	'$scope',
	'$http',
	function($rootScope, $scope, $http) {
		// fields
		$scope.iframeURL = `https://accept.paymobsolutions.com/api/acceptance/iframes/${
			$rootScope.weAcceptIframeKey
		}?payment_token=`;
		$scope.obj = {
			amount: 1000,
			firstName: '',
			lastName: '',
			phone: '',
			email: '',
		};
		$scope.paymentKey = '';
		$scope.loading = false;
		$scope.showCopied = false;

		$scope.getPaymentKey = function() {
			$scope.paymentKey = '';
			if ($scope.obj.amount) {
				$scope.loading = true;
				$http({
					url: $rootScope.requestsServerUrl + '/payments/key/' + $scope.obj.amount,
					method: 'GET',
					params: $scope.obj,
				})
					.success(function(response) {
						$scope.loading = false;
						$scope.showCopied = false;
						$scope.paymentKey = response.paymentKey;
						$scope.copyToClipboard();
					})
					.error(function(err) {
						$scope.loading = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
					});
			}
		};

		$scope.copyToClipboard = () => {
			const el = document.createElement('textarea');
			el.value = $scope.iframeURL + $scope.paymentKey;
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
			$scope.showCopied = true;
		};
	},
]);
