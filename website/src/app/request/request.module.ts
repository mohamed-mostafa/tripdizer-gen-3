import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

/* Modules */
import { COMPONENTS as RequestComponents, RequestRoutingModule } from './request-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  declarations: [
    ...RequestComponents
  ]
})
export class RequestModule { }
