var budgetCalculationBusiness = require('../business/hws_budget_calculation_business.js')

var budgetCalculation = function(req, res) {
	try {
		var request = req.body.request;
		// call the business function and give it a callback function
		budgetCalculationBusiness.budgetCalculation(
			request,
			function(request) {
				res.json(request);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(userErrorMessage) {
				res.status(500).send(userErrorMessage);
			}
		);
	} catch (error) {
		console.log('An error occurred in /itineraries/budgetCalculation');
		console.log(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.budgetCalculation = budgetCalculation;