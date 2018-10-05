var itirnaryDaoMock = {
	getById: function (requestId, language, onSuccess, onFailure) { 
		var itinerary = {
			ferries: [{MAY: 300}],
			flights: [{aMAY: 7000, iMAY: 1000, kMAY: 5000}],
			hotels: [{budget_category_id: 2, MAY: 100}],
		};
		onSuccess(itinerary);
	},
	getAllLong: function (onSuccess, onFailure) { 
		var BALI = {
			id:1,
			en_name: "BALI",
			needsVisa: false,
			seasons: [
				{start: '01-01-2018', end: '03-31-2018', type: 2}, // shoulder season
				{start: '04-01-2018', end: '09-30-2018', type: 0},// high season
				{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
			], 
			budgetCategories: [
				{budget_category_Id: 2, Percentage: 100}, // super economy
				{budget_category_Id: 3, Percentage: 100}, // economy
				{budget_category_Id: 4, Percentage: 100}, // mid-range
				{budget_category_Id: 5, Percentage: 100} // splurge
			],
			purposes: [
				{travel_purpose_Id: 2, Percentage: 0}, // solo
				{travel_purpose_Id: 3, Percentage: 0}, // family
				{travel_purpose_Id: 4, Percentage: 0}, // group
				{travel_purpose_Id: 5, Percentage: 100}, // honeymoon
				{travel_purpose_Id: 6, Percentage: 0} // business
			],
			interests: [
				{interest_Id: 1, Percentage: 100}, // activities
				{interest_Id: 2, Percentage: 50}, // history
				{interest_Id: 3, Percentage: 25}, // night life
				{interest_Id: 4, Percentage: 100}, // beaches
				{interest_Id: 5, Percentage: 50}, // nature
				{interest_Id: 6, Percentage: 50} // shopping
			]
		};

		var EGYPT = {
			id:2,
			en_name: "EGYPT",
			needsVisa: false,
			seasons: [
				{start: '01-01-2018', end: '03-31-2018', type: 0}, // high season
				{start: '04-01-2018', end: '09-30-2018', type: 2},// shoulder season
				{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
			], 
			budgetCategories: [
				{budget_category_Id: 2, Percentage: 100}, // super economy
				{budget_category_Id: 3, Percentage: 100}, // economy
				{budget_category_Id: 4, Percentage: 100}, // mid-range
				{budget_category_Id: 5, Percentage: 100} // splurge
			],
			purposes: [
				{travel_purpose_Id: 2, Percentage: 0}, // solo
				{travel_purpose_Id: 3, Percentage: 100}, // family
				{travel_purpose_Id: 4, Percentage: 100}, // group
				{travel_purpose_Id: 5, Percentage: 0}, // honeymoon
				{travel_purpose_Id: 6, Percentage: 0} // business
			],
			interests: [
				{interest_Id: 1, Percentage: 75}, // activities
				{interest_Id: 2, Percentage: 100}, // history
				{interest_Id: 3, Percentage: 25}, // night life
				{interest_Id: 4, Percentage: 100}, // beaches
				{interest_Id: 5, Percentage: 50}, // nature
				{interest_Id: 6, Percentage: 50} // shopping
			]
		};

		var NIPAL = {
			id:5,
			en_name: "NIPAL",
			needsVisa: false,
			seasons: [
				{start: '01-01-2018', end: '03-31-2018', type: 0}, // high season
				{start: '04-01-2018', end: '09-30-2018', type: 2},// shoulder season
				{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
			], 
			budgetCategories: [
				{budget_category_Id: 2, Percentage: 100}, // super economy
				{budget_category_Id: 3, Percentage: 100}, // economy
				{budget_category_Id: 4, Percentage: 100}, // mid-range
				{budget_category_Id: 5, Percentage: 100} // splurge
			],
			purposes: [
				{travel_purpose_Id: 2, Percentage: 0}, // solo
				{travel_purpose_Id: 3, Percentage: 100}, // family
				{travel_purpose_Id: 4, Percentage: 100}, // group
				{travel_purpose_Id: 5, Percentage: 0}, // honeymoon
				{travel_purpose_Id: 6, Percentage: 0} // business
			],
			interests: [
				{interest_Id: 1, Percentage: 100}, // activities
				{interest_Id: 2, Percentage: 100}, // history
				{interest_Id: 3, Percentage: 25}, // night life
				{interest_Id: 4, Percentage: 100}, // beaches
				{interest_Id: 5, Percentage: 50}, // nature
				{interest_Id: 6, Percentage: 50} // shopping
			]
		};

		var DUBAI = {
			id:3,
			en_name: "DUBAI",
			needsVisa: false,
			seasons: [
				{start: '01-01-2018', end: '03-31-2018', type: 0}, // high season
				{start: '04-01-2018', end: '09-30-2018', type: 2},// shoulder season
				{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
			], 
			budgetCategories: [
				{budget_category_Id: 2, Percentage: 0}, // super economy
				{budget_category_Id: 3, Percentage: 25}, // economy
				{budget_category_Id: 4, Percentage: 50}, // mid-range
				{budget_category_Id: 5, Percentage: 100} // splurge
			],
			purposes: [
				{travel_purpose_Id: 2, Percentage: 100}, // solo
				{travel_purpose_Id: 3, Percentage: 100}, // family
				{travel_purpose_Id: 4, Percentage: 100}, // group
				{travel_purpose_Id: 5, Percentage: 50}, // honeymoon
				{travel_purpose_Id: 6, Percentage: 100} // business
			],
			interests: [
				{interest_Id: 1, Percentage: 100}, // activities
				{interest_Id: 2, Percentage: 0}, // history
				{interest_Id: 3, Percentage: 100}, // night life
				{interest_Id: 4, Percentage: 0}, // beaches
				{interest_Id: 5, Percentage: 0}, // nature
				{interest_Id: 6, Percentage: 100} // shopping
			]
		};

		var PARIS = {
			id:4,
			en_name: "PARIS",
			needsVisa: false,
			seasons: [
				{start: '01-01-2018', end: '03-31-2018', type: 2}, // shoulder season
				{start: '04-01-2018', end: '09-30-2018', type: 0},// high season
				{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
			], 
			budgetCategories: [
				{budget_category_Id: 2, Percentage: 0}, // super economy
				{budget_category_Id: 3, Percentage: 25}, // economy
				{budget_category_Id: 4, Percentage: 50}, // mid-range
				{budget_category_Id: 5, Percentage: 100} // splurge
			],
			purposes: [
				{travel_purpose_Id: 2, Percentage: 100}, // solo
				{travel_purpose_Id: 3, Percentage: 100}, // family
				{travel_purpose_Id: 4, Percentage: 100}, // group
				{travel_purpose_Id: 5, Percentage: 50}, // honeymoon
				{travel_purpose_Id: 6, Percentage: 100} // business
			],
			interests: [
				{interest_Id: 1, Percentage: 100}, // activities
				{interest_Id: 2, Percentage: 0}, // history
				{interest_Id: 3, Percentage: 100}, // night life
				{interest_Id: 4, Percentage: 0}, // beaches
				{interest_Id: 5, Percentage: 0}, // nature
				{interest_Id: 6, Percentage: 100} // shopping
			]
		};

		var BANGKOK = {
			id:6,
			en_name: "BANGKOK",
			needsVisa: false,
			seasons: [
				{start: '01-01-2018', end: '03-31-2018', type: 2}, // shoulder season
				{start: '04-01-2018', end: '09-30-2018', type: 0},// high season
				{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
			], 
			budgetCategories: [
				{budget_category_Id: 2, Percentage: 25}, // super economy
				{budget_category_Id: 3, Percentage: 50}, // economy
				{budget_category_Id: 4, Percentage: 75}, // mid-range
				{budget_category_Id: 5, Percentage: 100} // splurge
			],
			purposes: [
				{travel_purpose_Id: 2, Percentage: 100}, // solo
				{travel_purpose_Id: 3, Percentage: 100}, // family
				{travel_purpose_Id: 4, Percentage: 100}, // group
				{travel_purpose_Id: 5, Percentage: 50}, // honeymoon
				{travel_purpose_Id: 6, Percentage: 100} // business
			],
			interests: [
				{interest_Id: 1, Percentage: 100}, // activities
				{interest_Id: 2, Percentage: 0}, // history
				{interest_Id: 3, Percentage: 100}, // night life
				{interest_Id: 4, Percentage: 0}, // beaches
				{interest_Id: 5, Percentage: 0}, // nature
				{interest_Id: 6, Percentage: 100} // shopping
			]
		};

		var KUALALUMPUR = {
			id:7,
			en_name: "KUALALUMPUR",
			needsVisa: false,
			seasons: [
				{start: '01-01-2018', end: '03-31-2018', type: 2}, // shoulder season
				{start: '04-01-2018', end: '09-30-2018', type: 0},// high season
				{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
			], 
			budgetCategories: [
				{budget_category_Id: 2, Percentage: 25}, // super economy
				{budget_category_Id: 3, Percentage: 50}, // economy
				{budget_category_Id: 4, Percentage: 75}, // mid-range
				{budget_category_Id: 5, Percentage: 100} // splurge
			],
			purposes: [
				{travel_purpose_Id: 2, Percentage: 100}, // solo
				{travel_purpose_Id: 3, Percentage: 100}, // family
				{travel_purpose_Id: 4, Percentage: 100}, // group
				{travel_purpose_Id: 5, Percentage: 50}, // honeymoon
				{travel_purpose_Id: 6, Percentage: 100} // business
			],
			interests: [
				{interest_Id: 1, Percentage: 100}, // activities
				{interest_Id: 2, Percentage: 0}, // history
				{interest_Id: 3, Percentage: 100}, // night life
				{interest_Id: 4, Percentage: 0}, // beaches
				{interest_Id: 5, Percentage: 0}, // nature
				{interest_Id: 6, Percentage: 99} // shopping
			]
		};
		onSuccess([BALI, EGYPT, DUBAI, PARIS, BANGKOK, NIPAL, KUALALUMPUR]);
	}
}

exports.itirnaryDaoMock = itirnaryDaoMock;