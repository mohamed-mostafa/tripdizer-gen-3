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
			$scope.introductionMissing = false;
			$scope.includesMissing = false;
			$scope.excludesMissing = false;
			$scope.visaTypeMissing = false;
			$scope.visaRequirementsMissing = false;
			$scope.ISOCodeMissing = false;
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
			if ($scope.newCountry.introduction == null || $scope.newCountry.introduction == '') {
				$scope.introductionMissing = true;
			}
			if ($scope.newCountry.includes == null || $scope.newCountry.includes == '') {
				$scope.includesMissing = true;
			}
			if ($scope.newCountry.excludes == null || $scope.newCountry.excludes == '') {
				$scope.excludesMissing = true;
			}
			if ($scope.newCountry.visaType == null || $scope.newCountry.visaType == '') {
				$scope.visaTypeMissing = true;
			}
			if ($scope.newCountry.visaRequirements == null || $scope.newCountry.visaRequirements == '') {
				$scope.visaRequirementsMissing = true;
			}
			if ($scope.newCountry.ISOCode == null || $scope.newCountry.ISOCode == '') {
				$scope.ISOCodeMissing = true;
			}
			return (
				$scope.enNameMissing !== true &&
				$scope.arNameMissing !== true &&
				$scope.enDescriptionMissing !== true &&
				$scope.arDescriptionMissing !== true &&
				$scope.thumbnailMissing !== true &&
				$scope.introductionMissing !== true &&
				$scope.includesMissing !== true &&
				$scope.excludesMissing !== true &&
				$scope.visaTypeMissing !== true &&
				$scope.visaRequirementsMissing !== true &&
				$scope.ISOCodeMissing !== true
			);
		};
		$scope.addCountry = function(close) {
			if ($scope.newCountryIsValid()) {
				$scope.saving = true;
				$http
					.put($rootScope.masterDataServerUrl + '/country', { country: $scope.newCountry })
					.success(function(response) {
						$scope.saving = false;
						response.active = false;
						$scope.countries.push(response);
						if (close) {
							$('#addCountryModal').modal('hide');
						}
					})
					.error(function(err) {
						$scope.saving = false;
						$scope.serverError = true;
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
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
					.post($rootScope.masterDataServerUrl + '/country', { country: $scope.newCountry })
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
						$scope.serverErrorMessage = 'An error occurred at the server side: ' + err;
					});
			}
		};
		$scope.activate = function(id) {
			$http
				.post($rootScope.masterDataServerUrl + '/country/' + id + '/activate')
				.success(function() {
					for (var i = 0; i < $scope.countries.length; i++) {
						if ($scope.countries[i].id == id) {
							$scope.countries[i].active = 1;
						}
					}
					alert("Country is now visible on the website");
				})
				.error(function(err) {
					alert("Activation Failed: " + err.toString());
				});
		};
		$scope.deactivate = function(id) {
			$http
				.post($rootScope.masterDataServerUrl + '/country/' + id + '/deactivate')
				.success(function() {
					for (var i = 0; i < $scope.countries.length; i++) {
						if ($scope.countries[i].id == id) {
							$scope.countries[i].active = 0;
						}
					}
					alert("Country is now hidden from the website");
				})
				.error(function(err) {
					alert("Deactivation Failed: " + err.toString());
				});
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
			$scope.newCountry = {};
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
