/**
 *
 */

g2gControlCenterApplication.controller('CountriesPageContentController', [
	'$rootScope',
	'$scope',
	'$http',
	'CountriesService',
	'InterestsService',
	function($rootScope, $scope, $http, CountriesService, InterestsService) {
		// fields
		$scope.countries = [];

		// validation flags
		$scope.nameMissing = false;
		$scope.emailMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = '';
		// form fields
		$scope.newCountry = {};
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
			$scope.thumbnailMissing = false;
			$scope.serverError = false;
			$scope.serverErrorMessage = '';
		};
		$scope.newCountryIsValid = function() {
			$scope.resetValidationFlags();
			if ($scope.newCountry.enName == null || $scope.newCountry.enName == '') {
				$scope.enNameMissing = true;
			}
			if ($scope.newCountry.arName == null || $scope.newCountry.arName == '') {
				$scope.arNameMissing = true;
			}
			if ($scope.newCountry.enDescription == null || $scope.newCountry.enDescription == '') {
				$scope.enDescriptionMissing = true;
			}
			if ($scope.newCountry.arDescription == null || $scope.newCountry.arDescription == '') {
				$scope.arDescriptionMissing = true;
			}
			if ($scope.newCountry.thumbnail == null || $scope.newCountry.thumbnail == '') {
				$scope.thumbnailMissing = true;
			}
			return (
				$scope.enNameMissing !== true &&
				$scope.arNameMissing !== true &&
				$scope.enDescriptionMissing !== true &&
				$scope.arDescriptionMissing !== true &&
				$scope.thumbnailMissing !== true
			);
		};
		$scope.addCountry = function(close) {
			if ($scope.newCountryIsValid()) {
				$scope.saving = true;
				console.log($scope.newCountry);
				$http
					.put($rootScope.serverURL + '/country', { country: $scope.newCountry })
					.success(function(response) {
						$scope.saving = false;
						$scope.countries.push(response);
						if (close) {
							$('#addCountryModal').modal('hide');
						}
					})
					.error(function(err) {
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
					});
			}
		};
		$scope.editCountry = function(id) {
			console.log($scope.newCountry);
			console.log($scope.newCountryIsValid());
			$scope.resetValidationFlags();
			if ($scope.newCountryIsValid()) {
				$scope.saving = true;
				$http
					.post($rootScope.serverURL + '/country', { country: $scope.newCountry })
					.success(function(response) {
						for (var i = 0; i < $scope.countries.length; i++) {
							if ($scope.countries[i].id == $scope.newCountry.id) {
								$scope.countries[i] = $scope.newCountry;
								break;
							}
						}
						$scope.saving = false;
						$scope.editMode = false;
						$('#addCountryModal').modal('hide');
					})
					.error(function(err) {
						$scope.newCountry = {};
						$scope.editMode = false;
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occured at the server side: ' + err;
					});
			}
		};
		$scope.openEditDialog = function(id) {
			$scope.editMode = true;
			for (var i = 0; i < $scope.countries.length; i++) {
				if ($scope.countries[i].id == id) {
					$scope.newCountry = $scope.countries[i];
				}
			}
			$('#addCountryModal').modal('show');
		};
		$scope.openAddDialog = function(id) {
			$scope.editMode = false;
			$('#addCountryModal').modal('show');
		};
		$scope.buildTable = function() {
			// initialize the table
			$(function() {
				$('#countriesTable').dataTable({
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
			CountriesService.getAll().then(function(countries) {
				$scope.countries = countries;
			});

			InterestsService.getAll().then(function(interests) {
				$scope.interests = interests;
			});
		};

		$scope.initialize();
	},
]);
