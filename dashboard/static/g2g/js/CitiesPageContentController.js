g2gControlCenterApplication.controller('CitiesPageContentController', [
	'$rootScope',
	'$scope',
	'$http',
	'CitiesService',
	'CountriesService',
	'InterestsService',
	'BudgetCategoriesService',
	function($rootScope, $scope, $http, CitiesService, CountriesService, InterestsService, BudgetCategoriesService) {
		// fields
		$scope.cities = [];

		// validation flags
		$scope.nameMissing = false;
		$scope.emailMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = '';
		// form fields
		$scope.newCity = {};
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
			$scope.countryIdMissing = false;
			$scope.thumbnailMissing = false;
			$scope.latMissing = false;
			$scope.lngMissing = false;
			$scope.serverError = false;
			$scope.serverErrorMessage = '';
		};
		$scope.newCityIsValid = function() {
			$scope.resetValidationFlags();
			if ($scope.newCity.enName == null || $scope.newCity.enName == '') {
				$scope.enNameMissing = true;
			}
			if ($scope.newCity.arName == null || $scope.newCity.arName == '') {
				$scope.arNameMissing = true;
			}
			if ($scope.newCity.enDescription == null || $scope.newCity.enDescription == '') {
				$scope.enDescriptionMissing = true;
			}
			if ($scope.newCity.arDescription == null || $scope.newCity.arDescription == '') {
				$scope.arDescriptionMissing = true;
			}
			if ($scope.newCity.countryId == null || $scope.newCity.countryId == '') {
				$scope.countryIdMissing = true;
			}
			if ($scope.newCity.thumbnail == null || $scope.newCity.thumbnail == '') {
				$scope.thumbnailMissing = true;
			}
			if ($scope.newCity.lat == null || $scope.newCity.lat == '') {
				$scope.latMissing = true;
			}
			if ($scope.newCity.lng == null || $scope.newCity.lng == '') {
				$scope.lngMissing = true;
			}
			return (
				$scope.enNameMissing !== true &&
				$scope.arNameMissing !== true &&
				$scope.enDescriptionMissing !== true &&
				$scope.arDescriptionMissing !== true &&
				$scope.latMissing !== true &&
				$scope.lngMissing !== true &&
				$scope.countryIdMissing !== true &&
				$scope.thumbnailMissing !== true
			);
		};
		$scope.addCity = function(close) {
			if ($scope.newCityIsValid()) {
				$scope.saving = true;
				console.log($scope.newCity);
				$http
					.put($rootScope.serverURL + '/city', { city: $scope.newCity })
					.success(function(response) {
						$scope.saving = false;
						$scope.cities.push(response);
						if (close) {
							$('#addCityModal').modal('hide');
						}
					})
					.error(function(err) {
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
					});
			}
		};
		$scope.editCity = function(id) {
			console.log($scope.newCity);
			console.log($scope.newCityIsValid());
			$scope.resetValidationFlags();
			if ($scope.newCityIsValid()) {
				$scope.saving = true;
				$http
					.post($rootScope.serverURL + '/city', { city: $scope.newCity })
					.success(function(response) {
						for (var i = 0; i < $scope.cities.length; i++) {
							if ($scope.cities[i].id == $scope.newCity.id) {
								$scope.cities[i] = $scope.newCity;
								break;
							}
						}
						$scope.saving = false;
						$scope.editMode = false;
						$('#addCityModal').modal('hide');
					})
					.error(function(err) {
						$scope.newCity = {};
						$scope.editMode = false;
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
					});
			}
		};
		$scope.openEditDialog = function(id) {
			$scope.editMode = true;
			for (var i = 0; i < $scope.cities.length; i++) {
				if ($scope.cities[i].id == id) {
					$scope.newCity = $scope.cities[i];
				}
			}
			$('#addCityModal').modal('show');
		};
		$scope.openAddDialog = function(id) {
			$scope.editMode = false;
			$('#addCityModal').modal('show');
		};
		$scope.buildTable = function() {
			// initialize the table
			$(function() {
				$('#citiesTable').dataTable({
					bPaginate: true,
					bLengthChange: false,
					bFilter: false,
					bSort: true,
					bInfo: true,
					bAutoWidth: false,
				});
			});
		};
		$scope.initialize = function() {
			CitiesService.getAll().then(function(cities) {
				$scope.cities = cities;
			});

			CountriesService.getAll().then(function(countries) {
				$scope.countries = countries;
			});

			InterestsService.getAll().then(function(interests) {
				$scope.interests = interests;
			});

			BudgetCategoriesService.getAll().then(function(budgetCategories) {
				$scope.budgetCategories = budgetCategories;
			});
		};

		$scope.initialize();
	},
]);
