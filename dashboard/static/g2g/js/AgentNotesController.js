/**
 * 
 */

g2gControlCenterApplication.controller("AgentNotesController", ['$rootScope', '$scope', '$http', 'ItinerariesService', function ($rootScope, $scope, $http, ItinerariesService) {
	// fields
	$scope.destinations = [];

	// validation flags
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.destination = {};
	$scope.editMode = true;

	$scope.loading = false;
	$scope.saving = false;
	$scope.currentId = 0;

	// functions
	$scope.resetValidationFlags = function () {
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	
	$scope.editDestination = function (id) {
		$scope.resetValidationFlags();
		$scope.saving = true;
		$http.post($rootScope.serverURL + "/itinerary/note", { id: $scope.destination.id, note: $scope.destination.agentNotes }
		).success(
			function (response) {
				$scope.saving = false;
				$scope.editMode = false;
				$('#editDestinationModal').modal('hide');
			}
			).error(function (err) {
				$scope.destination = {};
				$scope.editMode = false;
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
	};
	$scope.openEditDialog = function (id) {
		$scope.editMode = true;
		for (var i = 0; i < $scope.destinations.length; i++) {
			if ($scope.destinations[i].id == id) {
				$scope.destination = $scope.destinations[i];
			}
		}
		$('#editDestinationModal').modal('show');
	};
	
	$scope.initialize = function () {
		ItinerariesService.getAll().then(function (destinations) {
			$scope.destinations = destinations;
		});
	};

	$scope.initialize();
}]);