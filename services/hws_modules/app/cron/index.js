var cron = require('cron');
var requestsBusiness = require('../../business/hws_requests_business');

var cronJob = cron.job('0 0 */1 * *', function() {
	if (process.env.ENABLE_DAILY_STATISTICS_CRON == 'TRUE') {
		requestsBusiness.sendDailyReportOfRequestsCount();
	}
});
cronJob.start();
