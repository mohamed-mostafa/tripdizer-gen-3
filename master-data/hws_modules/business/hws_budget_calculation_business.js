var budgetCategoriesDao = require('../dataaccess/hws_budgetcategories_dao.js');
var itinerariesDao = require('../dataaccess/hws_itineraries_dao.js');
var DateDiff = require('date-diff');

var budgetCalculation = function(request, onSuccess, onFailure, onUserError) {
	var monthMap = {
		1: 'JAN',
		2: 'FEB',
		3: 'MAR',
		4: 'APR',
		5: 'MAY',
		6: 'JUN',
		7: 'JUL',
		8: 'AUG',
		9: 'SEP',
		10: 'OCT',
		11: 'NOV',
		12: 'DEC',
	};
	request = {
		...request,
		departureDate: request.departureDate || request.departure_date,
		returnDate: request.returnDate || request.return_date,
		adultsNumber: request.adultsNumber || request.number_of_adults,
		kidsNumber: request.kidsNumber || request.number_of_kids || 0,
		infantsNumber: request.infantsNumber || request.number_of_infants || 0,
		budgetCategory: request.budgetCategory || request.budget_category,
		destination: request.destination || request.itinerary_id,
	};
	if (request.destination) {
		itinerariesDao.getById(
			request.destination,
			null,
			async function(itinerary) {
				if (itinerary) {
					var diff = new DateDiff(new Date(request.returnDate), new Date(request.departureDate));
					const rData = {
						itineraryId: itinerary.id,
						iternaryName: itinerary.en_name,
						iternaryArabicName: itinerary.ar_name,
						dailySpending: 0,
						adultsNumber: request.adultsNumber,
						kidsNumber: request.kidsNumber,
						infantsNumber: request.infantsNumber,
						numberOfTravelers: request.adultsNumber + request.kidsNumber + request.infantsNumber,
						adultsNumberAndKids: request.adultsNumber + request.kidsNumber,
						departureMonth: monthMap[new Date(request.departureDate).getMonth() + 1],
						returnMonth: monthMap[new Date(request.returnDate).getMonth() + 1],
						numberOfRooms: 0,
						totalBudget: 0,
						flightsBudget: 0,
						numberOfNights: Math.abs(diff.days()),
						accommodationBudget: 0,
						ferriesBudget: 0,
					};

					const dailySpending = [];
					itinerary.cities.forEach(city =>
						dailySpending.push(
							...city.dailySpending.filter(
								dailySpending =>
									dailySpending.budgetCategory === (request.budgetCategory === 1 ? 3 : request.budgetCategory)
							)
						)
					);
					if (dailySpending.length)
						rData.dailySpending = dailySpending.reduce((ac, cv) => cv.dailySpending + ac, 0) / dailySpending.length;

					for (let i = 0, ferries = itinerary.ferries; i < ferries.length; ++i) {
						rData.ferriesBudget +=
							(rData.adultsNumberAndKids * (ferries[i][rData.departureMonth] + ferries[i][rData.returnMonth])) / 2;
					}

					for (let i = 0, flights = itinerary.flights; i < flights.length; ++i) {
						rData.flightsBudget +=
							(rData.adultsNumber * (flights[i]['a' + rData.departureMonth] + flights[i]['a' + rData.returnMonth])) / 2;
						rData.flightsBudget +=
							(rData.kidsNumber * (flights[i]['k' + rData.departureMonth] + flights[i]['k' + rData.returnMonth])) / 2;
						rData.flightsBudget +=
							(rData.infantsNumber * (flights[i]['i' + rData.departureMonth] + flights[i]['i' + rData.returnMonth])) /
							2;
					}

					if (request.budgetCategory === 1) {
						const budgetsPerBudgetCategories = await new Promise(resolve =>
							budgetCategoriesDao.getAll(null, budgetCategories => {
								resolve(
									budgetCategories
										.map(budgetCategory =>
											calculateAccomodationAvgBudgetByBudgetCategory(
												itinerary.hotels,
												budgetCategory.id,
												rData.numberOfNights,
												rData.departureMonth,
												rData.returnMonth
											)
										)
										.sort((a, b) => b - a)
								);
							})
						);

						rData.accommodationBudget =
							budgetsPerBudgetCategories.find(b => b < request.budget) || budgetsPerBudgetCategories.pop();
					} else {
						rData.accommodationBudget = calculateAccomodationAvgBudgetByBudgetCategory(
							itinerary.hotels,
							request.budgetCategory,
							rData.numberOfNights,
							rData.departureMonth,
							rData.returnMonth
						);
					}

					// the accomodation budgt is the price per peron for hostels (super economy) or the rate f the room otherwis
					if (request.budgetCategory == 2) {
						// super economy
						rData.accommodationBudget = rData.accommodationBudget * rData.adultsNumberAndKids;
					} else {
						rData.accommodationBudget = calculateAccomodationBudgetByRoom(
							rData.accommodationBudget,
							rData.adultsNumberAndKids
						);
					}

					// add 10% profit margin
					// rData.flightsBudget += rData.flightsBudget * 0.1;
					// rData.ferriesBudget += rData.ferriesBudget * 0.1;
					rData.accommodationBudget +=
						rData.accommodationBudget * 0.1 + rData.flightsBudget * 0.1 + rData.ferriesBudget * 0.1;

					rData.totalBudget += rData.ferriesBudget;
					rData.totalBudget += rData.flightsBudget;
					rData.totalBudget += rData.accommodationBudget;

					onSuccess(rData);
				} else {
					console.log("Itinerary Id doesn't exists!.");
					onFailure("Itinerary Id doesn't exists!.");
				}
			},
			function(err) {
				console.log('An error occurred while getting itinerary');
				console.log(err);
				onFailure(err);
			}
		);
	} else {
		console.log("Itinerary Id doesn't exists!.");
		onFailure("Itinerary Id doesn't exists!.");
	}
};

var calculateAccomodationAvgBudgetByBudgetCategory = (
	hotels,
	budgetCategory,
	numberOfNights,
	departureMonth,
	returnMonth
) => {
	hotels = hotels.filter(h => h.budget_category_id === budgetCategory);
	var budget = hotels.reduce((ac, cv) => ac + (numberOfNights * (cv[departureMonth] + cv[returnMonth])) / 2, 0);

	// take the average of the hotels of the same category
	return hotels.length > 0 ? budget / hotels.length : 0;
};
var calculateAccomodationBudgetByRoom = function(costOfAllNights, numbrtOfTravelers) {
	var regularRooms = Math.floor(numbrtOfTravelers / 2);
	var extraRooms = numbrtOfTravelers % 2;

	var cost = costOfAllNights;
	if (extraRooms == 0) {
		// regular rooms is 2, 4, 6, ... etc
		cost = costOfAllNights * regularRooms;
	} else {
		if (regularRooms == 0) {
			// number of adults = 1
			cost = costOfAllNights;
		} else {
			// number of adults = 3, 5, ... etc
			cost = costOfAllNights * (regularRooms - 1) + costOfAllNights * 1.35 * extraRooms;
		}
	}

	return cost;
};

exports.budgetCalculation = budgetCalculation;