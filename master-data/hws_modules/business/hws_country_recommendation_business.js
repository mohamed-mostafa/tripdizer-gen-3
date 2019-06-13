var budgetCalculationBusiness = require('./hws_budget_calculation_business.js');
var itinerariesDao = require('../dataaccess/hws_itineraries_dao.js');
var Promise = require('promise');

var recommendation = function(request, lang, onSuccess, onFailure, onUserError) {
	request = {
		...request,
		departureDate: request.departureDate || request.departure_date,
		returnDate: request.returnDate || request.return_date,
		budgetCategory: request.budgetCategory || request.budget_category,
		purpose: request.purpose || request.travel_purpose,
		preferences: request.preferences || request.interests,
	};
	itinerariesDao.getAllLong(async itineraries => {
		for (let i = 0; i < itineraries.length; i++) {
			itineraries[i].rank = 0;
			const budgetCalculation = await recommendationFuncs.budget(
				request,
				itineraries[i].id,
				itineraries[i].budgetCategories
			);
			itineraries[i].estimatedCost = budgetCalculation.totalBudget;
			itineraries[i].recommendationRanks = {
				budget: budgetCalculation.rank,
				purpose: recommendationFuncs.purpose(request.purpose, itineraries[i].purposes),
				season: recommendationFuncs.season(request.departureDate, request.returnDate, itineraries[i].seasons),
				interest: recommendationFuncs.interest(request.preferences, itineraries[i].interests),
				// visa: recommendationFuncs.visa(request.visa_assistance_needed, itineraries[i].needsVisa),
			};
			for (const rank in itineraries[i].recommendationRanks) {
				if (itineraries[i].recommendationRanks.hasOwnProperty(rank)) {
					let factor;
					switch (rank) {
						case 'budget':
							factor = 0.3;
							break;
						case 'purpose':
							factor = 0.2;
							break;
						case 'season':
							factor = 0.3;
							break;
						case 'interest':
							factor = 0.2;
							break;
						case 'visa':
							factor = 0;
							break;
						default:
							factor = 0;
							break;
					}
					itineraries[i].rank += factor * itineraries[i].recommendationRanks[rank];
				}
			}
		}
		onSuccess(
			itineraries
				.filter(i => i.id !== -1)
				.sort((a, b) => b.rank - a.rank)
				.map(i => ({
					id: i.id,
					name: i[`${lang.toLowerCase()}_name`],
					description: i[`${lang.toLowerCase()}_description`],
					enName: i.en_name,
					enDescription: i.en_description,
					arName: i.ar_name,
					arDescription: i.ar_description,
					image: i.image1,
					image1: i.image1,
					temperatureLo: i.temperatureLo,
					temperatureHi: i.temperatureHi,
					iataCode: i.iataCode,
					estimatedCost: i.estimatedCost,
					recommendationRanks: i.recommendationRanks,
					rank: i.rank,
				}))
		);
	}, onFailure);
};

var recommendationFuncs = {
	season: (requestDepartureDate, requestReturnDate, seasons) => {
		requestDepartureDate = new Date(requestDepartureDate);
		requestDepartureDate.setFullYear(1970);
		requestReturnDate = new Date(requestReturnDate);
		requestReturnDate.setFullYear(1970);
		for (let i = 0; i < seasons.length; i++) {
			const start = new Date(seasons[i].start),
				end = new Date(seasons[i].end);
			start.setFullYear(1970);
			end.setFullYear(1970);
			if (
				(requestDepartureDate > start && requestDepartureDate < end) ||
				(requestReturnDate > start && requestReturnDate < end)
			)
				return seasons[i].type == 0 ? 100 : seasons[i].type == 2 ? 50 : 0;
		}
		return 0;
	},
	budget: async (request, itineraryId, budgetCategories) =>
		await new Promise((resolve, reject) => {
			budgetCalculationBusiness.budgetCalculation(
				{ ...request, itinerary_id: itineraryId },
				function(calculation) {
					const requestBudgetCategory = request.budgetCategory;
					if (requestBudgetCategory == 1) {
						if (parseFloat(calculation.totalBudget) < parseFloat(request.budget)) calculation.rank = 100;
						else calculation.rank = 0;
					} else {
						for (let i = 0; i < budgetCategories.length; i++)
							if (budgetCategories[i].budget_category_Id == requestBudgetCategory)
								calculation.rank = budgetCategories[i].Percentage;
					}
					resolve(calculation);
				},
				reject,
				reject
			);
		}),
	purpose: (requestPurpose, purposes) => {
		// What if the purpose is "other"?
		for (let i = 0; i < purposes.length; i++)
			if (purposes[i].travel_purpose_Id == requestPurpose) return purposes[i].Percentage;
		return 0;
	},
	interest: (requestInterests, itineraryInterests) => {
		let sumOfInterests = 0;
		requestInterests = requestInterests.map(ri => ({
			id: ri.id || ri,
			percentage: ri.percentage || 100,
		}));
		for (let i = 0; i < requestInterests.length; i++) {
			itineraryInterest = itineraryInterests.find(ii => ii.interest_Id == requestInterests[i].id);
			if (itineraryInterest) {
				sumOfInterests += (requestInterests[i].percentage * itineraryInterest.Percentage) / 100;
			}
		}
		var nonZeroPercentInterestsInRequest = requestInterests.filter(ri => ri.percentage > 0);
		return sumOfInterests / nonZeroPercentInterestsInRequest.length;
	},
	visa: (request, itinerary) => {
		request = request ? 1 : 0;
		itinerary = itinerary ? 1 : 0;
		return request === itinerary ? 100 : 0;
	},
};

exports.recommendation = recommendation;