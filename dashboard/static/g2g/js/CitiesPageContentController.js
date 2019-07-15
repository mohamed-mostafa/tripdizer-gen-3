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
		$scope.selectedCountry = null;

		// validation flags
		$scope.nameMissing = false;
		$scope.emailMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = '';
		// form fields
		$scope.newCity = { countryId: $scope.selectedCountry };
		$scope.editMode = false;

		$scope.loading = false;
		$scope.saving = false;
		$scope.currentId = 0;
		
		// functions
		$scope.validateDataEntry = function() {
			var activeCitiesInCountry = $scope.cities.filter(city => city.active == 1);
			if (activeCitiesInCountry.length == 0) {
				$scope.dataEntryValid = false;
			} else {
				$scope.dataEntryValid = true;
			}
		}
		$scope.resetValidationFlags = function() {
			$scope.iataCodeMissing = false;
			$scope.enNameMissing = false;
			$scope.arNameMissing = false;
			$scope.enDescriptionMissing = false;
			$scope.arDescriptionMissing = false;
			$scope.countryIdMissing = false;
			$scope.thumbnailMissing = false;
			$scope.latMissing = false;
			$scope.lngMissing = false;
			$scope.visitOrderMissing = false;
			$scope.activeMissing = false;
			$scope.serverError = false;
			$scope.dailySpendingMissing = false;
			$scope.serverErrorMessage = '';
		};
		$scope.newCityIsValid = function(validateThumbnail) {
			$scope.resetValidationFlags();
			if ($scope.newCity.iataCode == null || $scope.newCity.iataCode == '' || $scope.newCity.iataCode.length != 3) {
				$scope.iataCodeMissing = true;
			}
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
			if (validateThumbnail && ($scope.newCity.thumbnail == null || $scope.newCity.thumbnail == '')) {
				$scope.thumbnailMissing = true;
			}
			if ($scope.newCity.lat == null || $scope.newCity.lat == ''|| isNaN($scope.newCity.lat)) {
				$scope.latMissing = true;
			}
			if ($scope.newCity.lng == null || $scope.newCity.lng == '' || isNaN($scope.newCity.lng)) {
				$scope.lngMissing = true;
			}
			if ($scope.newCity.visitOrder == null || $scope.newCity.visitOrder == ''|| isNaN($scope.newCity.visitOrder)) {
				$scope.visitOrderMissing = true;
			}
			if ($scope.newCity.dailySpending != null && $scope.newCity.dailySpending.length != 0) {
				for (var i = 0; i < $scope.budgetCategories.length; i++) {
					if ($scope.budgetCategories[i].id !== 1) {
						if ($scope.newCity.dailySpending[$scope.budgetCategories[i].id] == null || $scope.newCity.dailySpending[$scope.budgetCategories[i].id] == "") {
							$scope.dailySpendingMissing = true;
						}
					}
				}
			} else {
				$scope.dailySpendingMissing = true;
			}
			return (
				$scope.enNameMissing !== true &&
				$scope.arNameMissing !== true &&
				$scope.enDescriptionMissing !== true &&
				$scope.arDescriptionMissing !== true &&
				$scope.latMissing !== true &&
				$scope.lngMissing !== true &&
				$scope.countryIdMissing !== true &&
				$scope.dailySpendingMissing !== true &&
				$scope.thumbnailMissing !== true
			);
		};
		$scope.addCity = function(close) {
			if ($scope.newCityIsValid(true)) {
				$scope.saving = true;
				$http
					.put($rootScope.masterDataServerUrl + '/city', { city: $scope.newCity })
					.success(function(response) {
						$scope.saving = false;
						response.active = false;
						response.thumbnail = $rootScope.mediaBaseUrl + "/cities/" + response.cityIata + ".png";
						$scope.cities.push(response);
						$scope.validateDataEntry();
						if (close) {
							$('#addCityModal').modal('hide');
						}
					})
					.error(function(err) {
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
					});
			}
		};
		$scope.editCity = function(id) {
			$scope.resetValidationFlags();
			if ($scope.newCityIsValid(false)) {
				$scope.saving = true;
				if ($scope.newCity.thumbnail.includes($rootScope.mediaBaseUrl)) {
					delete $scope.newCity.thumbnail;
				}
				$http
					.post($rootScope.masterDataServerUrl + '/city', { city: $scope.newCity })
					.success(function(response) {
						for (var i = 0; i < $scope.cities.length; i++) {
							if ($scope.cities[i].id == $scope.newCity.id) {
								$scope.cities[i] = $scope.newCity;
								$scope.cities[i].thumbnail = $rootScope.mediaBaseUrl + "/cities/" + response.cityIata + ".png";
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
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
					});
			}
		};
		$scope.activate = function(id) {
			$http
				.post($rootScope.masterDataServerUrl + '/city/' + id + '/activate')
				.success(function() {
					for (var i = 0; i < $scope.cities.length; i++) {
						if ($scope.cities[i].id == id) {
							$scope.cities[i].active = 1;
						}
					}
					alert("City is now visible on the website");
					$scope.validateDataEntry();
				})
				.error(function(err) {
					alert("Activation Failed: " + err.toString());
				});
		};
		$scope.deactivate = function(id) {
			$http
				.post($rootScope.masterDataServerUrl + '/city/' + id + '/deactivate')
				.success(function() {
					for (var i = 0; i < $scope.cities.length; i++) {
						if ($scope.cities[i].id == id) {
							$scope.cities[i].active = 0;
						}
					}
					alert("City is now hidden from the website");
					$scope.validateDataEntry();
				})
				.error(function(err) {
					alert("Deactivation Failed: " + err.toString());
				});
		};
		$scope.openEditDialog = function(id) {
			$scope.editMode = true;
			$scope.resetValidationFlags();
			for (var i = 0; i < $scope.cities.length; i++) {
				if ($scope.cities[i].id == id) {
					$scope.newCity = $scope.cities[i];
					$scope.newCity.thumbnail = $rootScope.mediaBaseUrl + "/cities/" + $scope.newCity.iataCode + ".png";
				}
			}
			$('#addCityModal').modal('show');
		};
		$scope.openAddDialog = function(id) {
			$scope.editMode = false;
			$scope.resetValidationFlags();
			$scope.newCity = { countryId: $scope.selectedCountry };
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

		$scope.$watch('selectedCountry', function(val) {
			CitiesService.getAllByCountry(val).then(function(cities) {
				if (cities) $scope.cities = cities;
				$scope.validateDataEntry();
			});
		});

		$scope.initialize = function() {
			CountriesService.getAll().then(function(countries) {
				$scope.countries = countries;
				if (countries.length) $scope.selectedCountry = countries[0].id;
				else $scope.selectedCountry = null;
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
