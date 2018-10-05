/**
 * 
 */

g2gControlCenterApplication.controller("AgentNotesController", ['$rootScope', '$scope', '$http', 'CountriesService', function ($rootScope, $scope, $http, CountriesService) {
	// fields
	$scope.countries = [];

	// validation flags
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.country = {};
	$scope.editMode = true;

	$scope.loading = false;
	$scope.saving = false;
	$scope.currentId = 0;

	// functions
	$scope.resetValidationFlags = function () {
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	
	$scope.editCountry = function (id) {
		$scope.resetValidationFlags();
		$scope.saving = true;
		$http.post($rootScope.serverURL + "/country/note", { id: $scope.country.id, note: $scope.country.agentNotes }
		).success(
			function (response) {
				$scope.saving = false;
				$scope.editMode = false;
				$('#editCountryModal').modal('hide');
			}
			).error(function (err) {
				$scope.country = {};
				$scope.editMode = false;
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
	};
	$scope.openEditDialog = function (id) {
		$scope.editMode = true;
		for (var i = 0; i < $scope.countries.length; i++) {
			if ($scope.countries[i].id == id) {
				$scope.country = $scope.countries[i];
			}
		}
		$('#editCountryModal').modal('show');
	};
	
	$scope.initialize = function () {
		CountriesService.getAll().then(function (countries) {
			$scope.countries = countries;
		});
	};

	$scope.initialize();
}]);