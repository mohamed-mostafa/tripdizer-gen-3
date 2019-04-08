g2gControlCenterApplication.controller('EmailsController', [
	'$rootScope',
	'$scope',
	'$http',
	function($rootScope, $scope, $http) {
		// fields
		$scope.emails = [];
		$scope.loading = false;

		$scope.getEmails = function() {
			$scope.saving = true;
			$http
				.get($rootScope.serverURL + '/request/statuses/emails')
				.success(function(response) {
					$scope.saving = false;
					$scope.emails = response;
				})
				.error(function(err) {
					$scope.saving = false;
					$scope.serverError = true;
					$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
				});
		};

		$scope.getEmails();
	},
]);
