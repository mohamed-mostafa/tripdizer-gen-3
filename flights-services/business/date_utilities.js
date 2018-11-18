var getFirstWeekendOfMonth = function(month) {
	var date = new Date();
	date.setDate(1); // set the date to the start day of the month
	var currentMonth = date.getMonth() + 1; // getMonth is 0 based
	
	// if the required month is smaller than or equal the current month, assume it is in the next year.
	// current month in current year is never used, because we'll not handle in which day are we in current month. it might be last day !)
	if (month <= currentMonth) {
		date.setFullYear(date.getFullYear() + 1);
	}

	date.setMonth(month - 1);
	
	var dayOfWeek = date.getDay(); // 6: saturday, 0: sunday
	var differenceBetweenFirstWeekend = dayOfWeek % 6; 
	var firstWeekendOfMonth = date.getDate() + 6 - differenceBetweenFirstWeekend; // move to saturday

	date.setDate(firstWeekendOfMonth);

	return date;
}

var getFirstWeekdayOfMonth = function(month) {
	var date = new Date();
	date.setDate(1); // set the date to the start day of the month
	var currentMonth = date.getMonth() + 1; // getMonth is 0 based
	
	if (month <= currentMonth) { // if the required month is smaller than or equal the current month, assume it is in the next year
		date.setFullYear(date.getFullYear() + 1);
	}

	date.setMonth(month - 1);
	
	var dayOfWeek = date.getDay();
	if (dayOfWeek == 0) { // sunday
		date.setDate(date.getDate() + 1); // move one day forward to monday
	} else if (dayOfWeek == 6) { // saturday
		date.setDate(date.getDate() + 2); // move two days forward to monday
	}
	
	return date;
}

var getDatePairsForMonth = function(month) {
	var firstWeekendOfMonth = getFirstWeekendOfMonth(month);
	var secondWeekendOfMonth = new Date(firstWeekendOfMonth); secondWeekendOfMonth.setDate(secondWeekendOfMonth.getDate() + 7);
	var thirdWeekendOfMonth = new Date(firstWeekendOfMonth); thirdWeekendOfMonth.setDate(thirdWeekendOfMonth.getDate() + 14);
	
	var firstWeekdayOfMonth = getFirstWeekdayOfMonth(month);
	var oneWeekAhedFromFirstWeekdayOfMonth = new Date(firstWeekdayOfMonth); oneWeekAhedFromFirstWeekdayOfMonth.setDate(oneWeekAhedFromFirstWeekdayOfMonth.getDate() + 7);
	var twoWeeksAheadFromFirstWeekdayOfMonth =new Date(firstWeekdayOfMonth); twoWeeksAheadFromFirstWeekdayOfMonth.setDate(twoWeeksAheadFromFirstWeekdayOfMonth.getDate() + 14);

	var datePairs = [
		{departureDate: firstWeekendOfMonth.toISOString().split('T')[0], returnDate: secondWeekendOfMonth.toISOString().split('T')[0], type: "Weekend_to_weekend"},
		{departureDate: secondWeekendOfMonth.toISOString().split('T')[0], returnDate: thirdWeekendOfMonth.toISOString().split('T')[0], type: "Weekend_to_weekend"},
		{departureDate: firstWeekendOfMonth.toISOString().split('T')[0], returnDate: oneWeekAhedFromFirstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekend_to_weekday"},
		{departureDate: firstWeekdayOfMonth.toISOString().split('T')[0], returnDate: secondWeekendOfMonth.toISOString().split('T')[0], type: "Weekday_to_weekend"},
		{departureDate: firstWeekdayOfMonth.toISOString().split('T')[0], returnDate: oneWeekAhedFromFirstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekday_to_weekday"},
		{departureDate: oneWeekAhedFromFirstWeekdayOfMonth.toISOString().split('T')[0], returnDate: twoWeeksAheadFromFirstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekday_to_weekday"},
		{departureDate: firstWeekdayOfMonth.toISOString().split('T')[0], returnDate: twoWeeksAheadFromFirstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekday_to_weekday"},
		{departureDate: firstWeekendOfMonth.toISOString().split('T')[0], returnDate: twoWeeksAheadFromFirstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekend_to_weekday"},
	]

	return datePairs;
}

var getDatesForMonth = function(month) {
	var firstWeekendOfMonth = getFirstWeekendOfMonth(month);
	var secondWeekendOfMonth = new Date(firstWeekendOfMonth); secondWeekendOfMonth.setDate(secondWeekendOfMonth.getDate() + 7);
	var thirdWeekendOfMonth = new Date(firstWeekendOfMonth); thirdWeekendOfMonth.setDate(thirdWeekendOfMonth.getDate() + 14);
	
	var firstWeekdayOfMonth = getFirstWeekdayOfMonth(month);
	var oneWeekAhedFromFirstWeekdayOfMonth = new Date(firstWeekdayOfMonth); oneWeekAhedFromFirstWeekdayOfMonth.setDate(oneWeekAhedFromFirstWeekdayOfMonth.getDate() + 7);
	var twoWeeksAheadFromFirstWeekdayOfMonth =new Date(firstWeekdayOfMonth); twoWeeksAheadFromFirstWeekdayOfMonth.setDate(twoWeeksAheadFromFirstWeekdayOfMonth.getDate() + 14);

	var dates = [
		{departureDate: firstWeekendOfMonth.toISOString().split('T')[0], type: "Weekend"},
		{departureDate: secondWeekendOfMonth.toISOString().split('T')[0], type: "Weekend"},
		{departureDate: firstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekday"},
		{departureDate: oneWeekAhedFromFirstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekday"},
		{departureDate: twoWeeksAheadFromFirstWeekdayOfMonth.toISOString().split('T')[0], type: "Weekday"}
	]

	return dates;
}

exports.getDatesForMonth = getDatesForMonth;
exports.getDatePairsForMonth = getDatePairsForMonth;