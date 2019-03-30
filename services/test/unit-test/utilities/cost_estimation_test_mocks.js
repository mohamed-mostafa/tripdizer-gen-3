var itirnaryDaoMock = {
	getById: function(itinerary_id, language, onSuccess, onFailure) {
		if (itinerary_id == 1) {
			var itinerary = {
				cities: [],
				ferries: [{ JAN: 300, FEB: 400 }],
				flights: [{ aJAN: 7000, iJAN: 1000, kJAN: 5000, aFEB: 8000, iFEB: 2000, kFEB: 6000 }],
				hotels: [{ budget_category_id: 3, JAN: 100, FEB: 200 }, { budget_category_id: 5, JAN: 1000, FEB: 2000 }],
				dailySpendings: 100,
			};
			onSuccess(itinerary);
		} else if (itinerary_id == 2) {
			var itinerary = {
				cities: [],
				ferries: [{ JAN: 300 }, { JAN: 400 }],
				flights: [{ aJAN: 7000, iJAN: 1000, kJAN: 5000 }, { aJAN: 8000, iJAN: 2000, kJAN: 6000 }],
				hotels: [{ budget_category_id: 3, JAN: 100 }, { budget_category_id: 3, JAN: 200 }],
				dailySpendings: 100,
			};
			onSuccess(itinerary);
		}
	},
};

exports.itirnaryDaoMock = itirnaryDaoMock;
