g2gControlCenterApplication.controller('HotelsController', [
	'$rootScope',
	'$scope',
	'$http',
	'HotelsService',
	'CitiesService',
	'CountriesService',
	'BudgetCategoriesService',
	function($rootScope, $scope, $http, HotelsService, CitiesService, CountriesService, BudgetCategoriesService) {
		// fields
		$scope.hotels = [];
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
		$scope.newHotel = { cityId: $scope.selectedCity };
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
			$scope.budgetCategoryMissing = false;
			$scope.starsMissing = false;
			$scope.activeMissing = false;
			$scope.serverError = false;
			$scope.serverErrorMessage = '';
		};
		$scope.newHotelIsValid = function() {
			$scope.resetValidationFlags();
			if ($scope.newHotel.enName == null || $scope.newHotel.enName == '') {
				$scope.enNameMissing = true;
			}
			if ($scope.newHotel.arName == null || $scope.newHotel.arName == '') {
				$scope.arNameMissing = true;
			}
			if ($scope.newHotel.enDescription == null || $scope.newHotel.enDescription == '') {
				$scope.enDescriptionMissing = true;
			}
			if ($scope.newHotel.arDescription == null || $scope.newHotel.arDescription == '') {
				$scope.arDescriptionMissing = true;
			}
			if ($scope.newHotel.cityId == null || $scope.newHotel.cityId == '') {
				$scope.cityIdMissing = true;
			}
			if ($scope.newHotel.thumbnail == null || $scope.newHotel.thumbnail == '') {
				$scope.thumbnailMissing = true;
			}
			if ($scope.newHotel.budgetCategoryId == null || $scope.newHotel.budgetCategoryId == '') {
				$scope.budgetCategoryMissing = true;
			}
			if ($scope.newHotel.stars == null || $scope.newHotel.stars == '') {
				$scope.starsMissing = true;
			}
			return (
				$scope.enNameMissing !== true &&
				$scope.arNameMissing !== true &&
				$scope.enDescriptionMissing !== true &&
				$scope.arDescriptionMissing !== true &&
				$scope.cityIdMissing !== true &&
				$scope.thumbnailMissing !== true &&
				$scope.budgetCategoryMissing !== true &&
				$scope.starsMissing !== true
			);
		};
		$scope.addHotel = function(close) {
			if ($scope.newHotelIsValid()) {
				$scope.saving = true;
				console.log($scope.newHotel);
				$http
					.put($rootScope.masterDataServerUrl + '/hotel', { hotel: $scope.newHotel })
					.success(function(response) {
						$scope.saving = false;
						$scope.hotels.push(response);
						if (close) {
							$('#addHotelModal').modal('hide');
						}
					})
					.error(function(err) {
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
					});
			}
		};
		$scope.editHotel = function(id) {
			$scope.resetValidationFlags();
			if ($scope.newHotelIsValid()) {
				$scope.saving = true;
				$http
					.post($rootScope.masterDataServerUrl + '/hotel', { hotel: $scope.newHotel })
					.success(function(response) {
						for (var i = 0; i < $scope.hotels.length; i++) {
							if ($scope.hotels[i].id == $scope.newHotel.id) {
								$scope.hotels[i] = $scope.newHotel;
								break;
							}
						}
						$scope.saving = false;
						$scope.editMode = false;
						$('#addHotelModal').modal('hide');
					})
					.error(function(err) {
						$scope.newHotel = {};
						$scope.editMode = false;
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
					});
			}
		};
		$scope.openEditDialog = function(id) {
			$scope.editMode = true;
			for (var i = 0; i < $scope.hotels.length; i++) {
				if ($scope.hotels[i].id == id) {
					$scope.newHotel = $scope.hotels[i];
				}
			}
			$('#addHotelModal').modal('show');
		};
		$scope.openAddDialog = function(id) {
			$scope.editMode = false;
			$scope.newHotel = { cityId: $scope.selectedCity };
			$('#addHotelModal').modal('show');
		};
		$scope.buildTable = function() {
			// initialize the table
			$(function() {
				$('#hotelsTable').dataTable({
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
			HotelsService.getAllByCity($scope.selectedCity).then(function(hotels) {
				if (hotels) $scope.hotels = hotels;
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

			BudgetCategoriesService.getAll().then(function(budgetCategories) {
				$scope.budgetCategories = budgetCategories;
			});
		};

		$scope.initialize();
	},
]);
