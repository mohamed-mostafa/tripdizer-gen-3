g2gControlCenterApplication.controller('AttractionsController', [
	'$rootScope',
	'$scope',
	'$http',
	'AttractionsService',
	'CitiesService',
	'CountriesService',
	function($rootScope, $scope, $http, AttractionsService, CitiesService, CountriesService) {
		// fields
		$scope.attractions = [];
		$scope.cities = [];
		$scope.countries = [];
		$scope.selectedCountry = null;
		$scope.selectedCity = null;

		// validation flags
		$scope.nameMissing = false;
		$scope.emailMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = '';
		// form fields
		$scope.newAttraction = { cityId: $scope.selectedCity };
		$scope.editMode = false;

		$scope.loading = false;
		$scope.saving = false;
		$scope.currentId = 0;

		// functions
		$scope.resetValidationFlags = function() {
			$scope.enNameMissing = false;
			$scope.arNameMissing = false;
			$scope.enDescriptionMissing = false;
			$scope.arDescriptionMissing = false;
			$scope.cityIdMissing = false;
			$scope.thumbnailMissing = false;
			$scope.enCategoryMissing = false;
			$scope.arCategoryMissing = false;
			$scope.priorityMissing = false;
			$scope.serverError = false;
			$scope.serverErrorMessage = '';
		};
		$scope.newAttractionIsValid = function() {
			$scope.resetValidationFlags();
			if ($scope.newAttraction.enName == null || $scope.newAttraction.enName == '') {
				$scope.enNameMissing = true;
			}
			if ($scope.newAttraction.arName == null || $scope.newAttraction.arName == '') {
				$scope.arNameMissing = true;
			}
			if ($scope.newAttraction.enDescription == null || $scope.newAttraction.enDescription == '') {
				$scope.enDescriptionMissing = true;
			}
			if ($scope.newAttraction.arDescription == null || $scope.newAttraction.arDescription == '') {
				$scope.arDescriptionMissing = true;
			}
			if ($scope.newAttraction.cityId == null || $scope.newAttraction.cityId == '') {
				$scope.cityIdMissing = true;
			}
			if ($scope.newAttraction.thumbnail == null || $scope.newAttraction.thumbnail == '') {
				$scope.thumbnailMissing = true;
			}
			if ($scope.newAttraction.enCategory == null || $scope.newAttraction.enCategory == '') {
				$scope.enCategoryMissing = true;
			}
			if ($scope.newAttraction.arCategory == null || $scope.newAttraction.arCategory == '') {
				$scope.arCategoryMissing = true;
			}
			if ($scope.newAttraction.priority == null || $scope.newAttraction.priority == '') {
				$scope.priorityMissing = true;
			}
			return (
				$scope.enNameMissing !== true &&
				$scope.arNameMissing !== true &&
				$scope.enDescriptionMissing !== true &&
				$scope.arDescriptionMissing !== true &&
				$scope.cityIdMissing !== true &&
				$scope.enCategoryMissing !== true &&
				$scope.arCategoryMissing !== true &&
				$scope.thumbnailMissing !== true &&
				$scope.priorityMissing !== true
			);
		};
		$scope.addAttraction = function(close) {
			if ($scope.newAttractionIsValid()) {
				$scope.saving = true;
				console.log($scope.newAttraction);
				$http
					.put($rootScope.masterDataServerUrl + '/attraction', { attraction: $scope.newAttraction })
					.success(function(response) {
						$scope.saving = false;
						$scope.attractions.push(response);
						if (close) {
							$('#addAttractionModal').modal('hide');
						}
					})
					.error(function(err) {
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
					});
			}
		};
		$scope.editAttraction = function(id) {
			$scope.resetValidationFlags();
			if ($scope.newAttractionIsValid()) {
				$scope.saving = true;
				$http
					.post($rootScope.masterDataServerUrl + '/attraction', { attraction: $scope.newAttraction })
					.success(function(response) {
						for (var i = 0; i < $scope.attractions.length; i++) {
							if ($scope.attractions[i].id == $scope.newAttraction.id) {
								$scope.attractions[i] = $scope.newAttraction;
								break;
							}
						}
						$scope.saving = false;
						$scope.editMode = false;
						$('#addAttractionModal').modal('hide');
					})
					.error(function(err) {
						$scope.newAttraction = {};
						$scope.editMode = false;
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
					});
			}
		};
		$scope.activate = function(id) {
			$http
				.post($rootScope.masterDataServerUrl + '/attraction/' + id + '/activate')
				.success(function() {
					for (var i = 0; i < $scope.attractions.length; i++) {
						if ($scope.attractions[i].id == id) {
							$scope.attractions[i].active = 1;
						}
					}
					alert("Attraction is now visible on the website");
				})
				.error(function(err) {
					alert("Activation Failed: " + err.toString());
				});
		};
		$scope.deactivate = function(id) {
			$http
				.post($rootScope.masterDataServerUrl + '/attraction/' + id + '/deactivate')
				.success(function() {
					for (var i = 0; i < $scope.attractions.length; i++) {
						if ($scope.attractions[i].id == id) {
							$scope.attractions[i].active = 0;
						}
					}
					alert("Attraction is now hidden from the website");
				})
				.error(function(err) {
					alert("Deactivation Failed: " + err.toString());
				});
		};
		$scope.openEditDialog = function(id) {
			$scope.editMode = true;
			$scope.resetValidationFlags();
			for (var i = 0; i < $scope.attractions.length; i++) {
				if ($scope.attractions[i].id == id) {
					$scope.newAttraction = $scope.attractions[i];
				}
			}
			$('#addAttractionModal').modal('show');
		};
		$scope.openAddDialog = function(id) {
			$scope.editMode = false;
			$scope.resetValidationFlags();
			$scope.newAttraction = { cityId: $scope.selectedCity };
			$('#addAttractionModal').modal('show');
		};
		$scope.buildTable = function() {
			// initialize the table
			$(function() {
				$('#attractionsTable').dataTable({
					bPaginate: true,
					bLengthChange: false,
					bFilter: false,
					bSort: true,
					bInfo: true,
					bAutoWidth: false,
				});
			});
		};

		$scope.$watch('selectedCity', function(val) {
			AttractionsService.getAllByCity($scope.selectedCity).then(function(attractions) {
				if (attractions) $scope.attractions = attractions;
			});
		});

		$scope.$watch('selectedCountry', function(val) {
			$scope.selectedCity = null;
			CitiesService.getAllByCountry(val).then(function(cities) {
				if (cities) $scope.cities = cities;
				if (cities.length) $scope.selectedCity = cities[0].id;
				else $scope.selectedCity = null;
			});
		});

		$scope.initialize = function() {
			CountriesService.getAll().then(function(countries) {
				$scope.countries = countries;
				if (countries.length) $scope.selectedCountry = countries[0].id;
				else $scope.selectedCountry = null;
			});
		};

		$scope.initialize();
		$scope.resetValidationFlags();
	},
]);
