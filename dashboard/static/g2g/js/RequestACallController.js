g2gControlCenterApplication.controller('RequestACallController', [
	'$rootScope',
	'$scope',
	'$http',
	'requestACallService',
	function($rootScope, $scope, $http, requestACallService) {
		// fields
		$scope.RequestACall = [];
		$scope.loading = false;

		$scope.initialize = function() {
			requestACallService.getAll().then(function(RequestACall) {
				$scope.RequestACall = RequestACall;
			});
		};
		$scope.initialize();
	},
]);
