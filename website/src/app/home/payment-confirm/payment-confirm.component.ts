import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
	selector: 'c-app-payment-confirm',
	templateUrl: './payment-confirm.component.html',
	styleUrls: ['./payment-confirm.component.scss']
})
export class PaymentConfirmComponent {

	success: string;
	responseCode: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.success = this.route.snapshot.queryParams.success;
		this.responseCode = this.route.snapshot.queryParams.txn_response_code;

		this.confirmSentParams(this.success, this.responseCode);
	}

	confirmSentParams(success, responseCode) {
		if (success && responseCode) {
			const responseCodes = ['0', '1', '2', '4', '5', '6'];
			if (!responseCodes.includes(responseCode)) {
				this.router.navigate(['/']);
			}
			if (success !== 'true' && success !== 'false') {
				this.router.navigate(['/']);
			}
		} else {
			this.router.navigate(['/']);
		}
	}

}
