g2gControlCenterApplication.controller('PaymentsController', [
	'$rootScope',
	'$scope',
	'$http',
	function($rootScope, $scope, $http) {
		// fields
		$scope.iframeURL = `https://accept.paymobsolutions.com/api/acceptance/iframes/${
			$rootScope.weAcceptIframeKey
		}?payment_token=`;
		$scope.amount = 1000;
		$scope.paymentKey = '';
		$scope.loading = false;
		$scope.showCopied = false;

		$scope.getPaymentKey = function() {
			$scope.paymentKey = '';
			if ($scope.amount) {
				$scope.loading = true;
				$http
					.get($rootScope.requestsServerUrl + '/payments/key/' + $scope.amount)
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
