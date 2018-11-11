import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';

/* Modules */
import { COMPONENTS as RequestComponents, RequestRoutingModule } from './request-routing.module';

/* Pipes */
import { ErrorMessagePipe } from '../shared/pipes/error-message.pipe';

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
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule
  ],
  declarations: [
    ...RequestComponents,
    RequestComponent,
    RequestNavBarComponent,
    RequestFormLayoutComponent,
    RequestLoadingComponent,
    ErrorMessagePipe
  ]
})
export class RequestModule { }
