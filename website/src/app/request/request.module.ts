import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

/* Modules */
import { COMPONENTS as RequestComponents, RequestRoutingModule } from './request-routing.module';
import { SharedModule } from '../shared/shared.module';

/* Components */
import { RequestFormLayoutComponent } from './form-layout/form-layout.component';
import { RequestLoadingComponent } from './loading/loading.component';
import { RequestNavBarComponent } from './nav-bar/nav-bar.component';
import { RequestComponent } from './request.component';

@NgModule({
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule
  ],
  declarations: [
    ...RequestComponents,
    RequestComponent,
    RequestNavBarComponent,
    RequestFormLayoutComponent,
    RequestLoadingComponent
  ]
})
export class RequestModule { }
