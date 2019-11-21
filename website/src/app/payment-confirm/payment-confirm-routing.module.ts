import { PaymentConfirmComponent } from './payment-confirm.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

    {
		path: '',
		component: PaymentConfirmComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentConfirmRoutingModule { }
