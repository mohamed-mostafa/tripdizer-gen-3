/**
 *
 */

g2gControlCenterApplication.controller('NewRequestController', [
	'$rootScope',
	'$scope',
	'$http',
	'PurposesService',
	'BudgetCategoriesService',
	'InterestsService',
	'ItinerariesService',
	'ProfessionsService',
	'ReferralTypesService',
	'StatusesService',
	'ChannelsService',
	function(
		$rootScope,
		$scope,
		$http,
		PurposesService,
		BudgetCategoriesService,
		InterestsService,
		ItinerariesService,
		ProfessionsService,
		ReferralTypesService,
		StatusesService,
		ChannelsService
	) {
		// fields
		$scope.isCreate = true;
		$scope.currentOrder = null;
		$scope.loading = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = '';

		$scope.resetCurrentOrder = function() {
			$scope.currentOrder = {
				traveler: {},
				preferences: [],
				travelingFrom: 'Cairo',
				departureDate: new Date(),
				returnDate: new Date(),
				travelHistory: 1,
				adultsNumber: 1,
			};
			$scope.currentOrder.returnDate.setDate($scope.currentOrder.departureDate.getDate() + 1);
		};
		$scope.resetCurrentOrder();

		$scope.create = function() {
			var noError = true;
			$scope.missingProps = '';
			const errorMsgPrefix = '<li>Please enter ';
			const errorMsgSuffix = '!</li>';
			if (!$scope.currentOrder.channel) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'request channel' + errorMsgSuffix;
			}
			if ($scope.currentOrder.traveler) {
				if (!$scope.currentOrder.traveler.name) {
					noError = false;
					$scope.missingProps += errorMsgPrefix + 'traveler name' + errorMsgSuffix;
				}
				if (!$scope.currentOrder.traveler.emailAddress) {
					noError = false;
					$scope.missingProps += errorMsgPrefix + 'traveler email' + errorMsgSuffix;
				}
				if (!$scope.currentOrder.traveler.mobile) {
					noError = false;
					$scope.missingProps += errorMsgPrefix + 'traveler phone' + errorMsgSuffix;
				}
			} else {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'traveler info' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.referralType) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'referral type' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.travelHistory) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'travel history' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.destination) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'destination' + errorMsgSuffix;
			}
			if ($scope.currentOrder.destination == -1 && !$scope.currentOrder.otherCountry) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'destination name' + errorMsgSuffix;
			}
			if ($scope.currentOrder.actualDestination == -1 && !$scope.currentOrder.otherActualDestination) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'actual destination name' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.departureDate) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'departure date' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.returnDate) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'return date' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.travelingFrom) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'traveling from' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.purpose) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'purpose' + errorMsgSuffix;
			}
			if ($scope.currentOrder.purpose == 1 && !$scope.currentOrder.otherPurposeName) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'purpose name' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.adultsNumber) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'adults number' + errorMsgSuffix;
			}
			if (!$scope.currentOrder.budgetCategory) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'budget category' + errorMsgSuffix;
			}
			if ($scope.currentOrder.budgetCategory == 1 && !$scope.currentOrder.budget) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'budget' + errorMsgSuffix;
			}
			if ($scope.isOtherInterestName() && !$scope.currentOrder.otherInterestName) {
				noError = false;
				$scope.missingProps += errorMsgPrefix + 'interest name' + errorMsgSuffix;
			}
			if (noError) {
				placeRequest();
			}
		};

		function placeRequest() {
			$scope.loading = true;
			$scope.serverError = false;
			$scope.serverErrorMessage = '';
			$http
				.put($rootScope.serverURL + '/request/dashboard/place', { request: $scope.currentOrder })
				.success(function(request) {
					$scope.resetCurrentOrder();
					// $scope.currentOrder = request;
					// $scope.isCreate = false;
					$scope.loading = false;
					$scope.serverError = false;
					$scope.serverErrorMessage = '';
				})
				.error(function(err) {
					$scope.loading = false;
					$scope.serverError = true;
					$scope.serverErrorMessage = err;
				});
		}

		$scope.isOtherInterestName = function() {
			if ($scope.currentOrder.preferences) {
				for (const key in $scope.currentOrder.preferences) {
					if ($scope.currentOrder.preferences.hasOwnProperty(key) && key == 0 && $scope.currentOrder.preferences[key]) {
						return true;
					}
				}
				delete $scope.currentOrder.otherInterestName;
				return false;
			}
			delete $scope.currentOrder.otherInterestName;
			return false;
		};

		$scope.$watch('currentOrder.actualDestination', function(val) {
			if (val == 999999) delete $scope.currentOrder.actualDestination;
		});

		PurposesService.getAll().then(function(purposes) {
			$scope.purposes = purposes;
			setFirstElementAsDefault(purposes, 'purpose', 'id');
		});

		BudgetCategoriesService.getAll().then(function(budgetCategories) {
			$scope.budgetCategories = budgetCategories;
			setFirstElementAsDefault(budgetCategories, 'budgetCategory', 'id');
		});

		InterestsService.getAll().then(function(interests) {
			$scope.interests = interests;
		});

		ItinerariesService.getAll().then(function(itineraries) {
			$scope.itineraries = itineraries;
			setFirstElementAsDefault(itineraries, 'destination', 'id');
		});

		ProfessionsService.getAll().then(function(professions) {
			$scope.professions = professions;
			setFirstElementAsDefault(professions, 'traveler.profession', 'id');
		});

		ReferralTypesService.getAll().then(function(referralTypes) {
			$scope.referralTypes = referralTypes;
			setFirstElementAsDefault(referralTypes, 'referralType', 'id');
		});

		StatusesService.getAll().then(function(statuses) {
			$scope.statuses = statuses;
			setFirstElementAsDefault(statuses, 'status', 'id');
		});

		ChannelsService.getAll().then(function(channels) {
			$scope.channels = channels;
		});

		function setFirstElementAsDefault(arr, prop, id) {
			var arrLen = arr.length;
			if (arrLen) {
				var obj = $scope.currentOrder;
				var pList = prop.split('.');
				var len = pList.length;
				for (var i = 0; i < len - 1; i++) {
					var elem = pList[i];
					if (!obj[elem]) obj[elem] = {};
					obj = obj[elem];
				}
				obj[pList[len - 1]] = arr[0][id];
			}
		}
	},
]);
