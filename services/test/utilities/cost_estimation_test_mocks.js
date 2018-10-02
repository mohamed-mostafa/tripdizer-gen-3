var itirnaryDaoMock = {
	getById: function (requestId, language, onSuccess, onFailure) { 
		var itinerary = {
			ferries: [{JAN: 300}],
			flights: [{aJAN: 7000, iJAN: 1000, kJAN: 5000}],
			hotels: [{budget_category_id: 1, JAN: 100}],
			dailySpendings: 100
		};
		onSuccess(itinerary);
	}
}

exports.itirnaryDaoMock = itirnaryDaoMock;