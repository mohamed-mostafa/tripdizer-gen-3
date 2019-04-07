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
	},
]);
