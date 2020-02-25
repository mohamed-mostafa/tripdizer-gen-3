import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SharedDialogComponent } from '../../../shared/components/shared-dialog/shared-dialog.component';
import { RequestService } from '../../request.service';
import { PaymentInfo } from './payment-step/payment.model';

@Component({
	selector: 'c-booking-steps',
	templateUrl: './booking-steps.component.html',
	styleUrls: ['./booking-steps.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class BookingStepsComponent implements AfterViewInit {
	formGroup = new FormGroup({});
	paymentKey: string;

	constructor(private requestService: RequestService, private router: Router, private dialog: MatDialog) {
		this.requestService.setProperty('requiresPayment', true);
	}

	// scroll to top when page load
	ngAfterViewInit() {
		window.scrollTo(0, 0);
	}

	openSessionDialog(message, url): void {
		this.dialog.open(SharedDialogComponent, { autoFocus: true, maxWidth: 600, data: { message, url } });
	}

	goToPaymentStep(stepper) {
		this.requestService.isLoading.next({ show: true, message: 'Re-validating prices and availability' });
		const travellers = { adults: {}, kids: {}, infants: {} };
		for (const controlName in this.formGroup.controls) {
			if (this.formGroup.controls.hasOwnProperty(controlName)) {
				if (this.formGroup.controls[controlName].value) {
					const info = controlName.match(/(adult|kid|infant)-([0-9]+)-(.+)/);
					if (info) {
						const type = info[1];
						const number = info[2];
						const control = info[3];
						travellers[`${type}s`] = travellers[`${type}s`] || {};
						travellers[`${type}s`][number] = travellers[`${type}s`][number] || {};
						travellers[`${type}s`][number][control] = this.formGroup.controls[controlName].value;
					}
				}
			}
		}
		const adults = Object.values(travellers.adults).map((adult, i) => ({
			...adult,
			ageGroup: 'adult',
			id: `adult-${i + 1}`,
		}));
		const kids = Object.values(travellers.kids).map((kid, i) => ({ ...kid, ageGroup: 'kid', id: `kid-${i + 1}` }));
		const infants = Object.values(travellers.infants).map((infant, i) => ({
			...infant,
			ageGroup: 'infant',
			id: `infant-${i + 1}`,
		}));

		this.requestService.setProperty('travellers', adults.concat(kids).concat(infants));
		this.requestService.submitRequestWithPayment().subscribe(
			(paymentInfo: PaymentInfo) => {
				if (paymentInfo) {
					this.paymentKey = paymentInfo.paymentKey;
					stepper.next();
				}
			},
			error => {
				this.requestService.isLoading.next({
					show: false,
					message: '',
				});
				this.openSessionDialog('request.estimated_cost.prices_availability_in_hotels', '/request/estimated-cost');
			}
		);
	}

	goToSummary() {
		this.router.navigate(['/request/summary']);
	}
}
