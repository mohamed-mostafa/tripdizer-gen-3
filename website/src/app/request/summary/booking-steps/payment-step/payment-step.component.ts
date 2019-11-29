import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'c-request-booking-payment-step',
	templateUrl: './payment-step.component.html',
	styleUrls: ['./payment-step.component.scss'],
})
export class BookingPaymentStepComponent implements OnInit {
	@Input() paymentKey: string;

	constructor(private sanitizer: DomSanitizer) {}

	ngOnInit() {}

	getSafeIFrameUrl() {
		const paymentIframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${
			environment.weAcceptIframeKey
		}?payment_token=${this.paymentKey}`;
		return this.sanitizer.bypassSecurityTrustResourceUrl(paymentIframeUrl);
	}
}
