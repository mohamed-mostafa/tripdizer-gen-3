import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { PaymentConfirmComponent } from './payment-confirm.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentConfirmRoutingModule } from './payment-confirm-routing.module';

@NgModule({
	declarations: [PaymentConfirmComponent],
	imports: [
		CommonModule,
		PaymentConfirmRoutingModule,
		SharedModule,
		CoreModule,
	]
})
export class PaymentConfirmModule { }
