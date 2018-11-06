import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { Ticket } from './ticket.model';

@Component({
  selector: 'c-request-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {
  currentStepPath: string;
  ticket: Ticket;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService
  ) {
    this.currentStepPath = this.route.routeConfig.path;
    requestService.submitRequest().subscribe((response: Ticket | null) => {
      if (response) {
        this.ticket = response;
      } else {
        this.router.navigate(['../', this.requestService.getPrevInvalidStep(this.currentStepPath)],
          { relativeTo: this.route });
      }
    });
    requestService.stepVisited(this.currentStepPath);
  }

}
