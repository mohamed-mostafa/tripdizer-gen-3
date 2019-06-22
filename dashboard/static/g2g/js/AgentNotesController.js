/**
 *
 */

g2gControlCenterApplication.controller('AgentNotesController', [
	'$rootScope',
	'$scope',
	'$http',
	'CitiesService',
	function($rootScope, $scope, $http, CitiesService) {
		// fields
		$scope.cities = [];

		// validation flags
		$scope.serverError = false;
		$scope.serverErrorMessage = '';
		// form fields
		$scope.city = {};
		$scope.editMode = true;

		$scope.loading = false;
		$scope.saving = false;
		$scope.currentId = 0;

		// functions
		$scope.resetValidationFlags = function() {
			$scope.serverError = false;
			$scope.serverErrorMessage = '';
		};

		$scope.editCity = function(id) {
			$scope.resetValidationFlags();
			$scope.saving = true;
			$http
				.post($rootScope.masterDataServerUrl + '/city/note', { id: $scope.city.id, note: $scope.city.agentNotes })
				.success(function(response) {
					$scope.saving = false;
					$scope.editMode = false;
					$('#editCityModal').modal('hide');
				})
				.error(function(err) {
					$scope.city = {};
					$scope.editMode = false;
					$scope.saving = false;
					$scope.serverError = true;
					$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
				});
		};
		$scope.openEditDialog = function(id) {
			$scope.editMode = true;
			for (var i = 0; i < $scope.cities.length; i++) {
				if ($scope.cities[i].id == id) {
					$scope.city = $scope.cities[i];
				}
			}
			$('#editCityModal').modal('show');
		};

		$scope.initialize = function() {
			CitiesService.getAll().then(function(cities) {
				$scope.cities = cities;
			});
		};

		$scope.initialize();
	},
]);
