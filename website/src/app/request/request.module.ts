import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Modules */
import { COMPONENTS as RequestComponents, RequestRoutingModule } from './request-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RequestRoutingModule
  ],
  declarations: [
    ...RequestComponents
  ]
})
export class RequestModule { }
