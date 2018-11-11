import { Component } from '@angular/core';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class RequestLoadingComponent {
  isLoading;

  constructor(requestService: RequestService) {
    requestService.isLoading.subscribe(isLoading => this.isLoading = isLoading);
  }

}
