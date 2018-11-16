import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
/* Components */
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
/* Services */
import { RequestService } from '../request.service';
/* Models */
import { Destination } from './destination.model';




@Component({
  selector: 'c-request-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss']
})
export class DestinationsComponent {
  currentStepPath: string;
  destinations: Array<Destination>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private dialog: MatDialog
  ) {
    this.currentStepPath = this.route.routeConfig.path;
    requestService.getDestinations().subscribe((response: Array<Destination>) => this.destinations = response);
    requestService.stepVisited(this.currentStepPath);
  }

  save(destinationId: number): boolean {
    const selectedDestination = this.destinations.find(p => p.id === destinationId);
    if (selectedDestination) {
      this.requestService.setProperty('destination', selectedDestination.id);
      this.requestService.setProperty('destinationName', selectedDestination.name);
      return true;
    }
    return false;
  }

  goToPrevStep() {
    this.router.navigate(['../', this.requestService.getPrevStep(this.currentStepPath)], { relativeTo: this.route });
  }

  goToNextStep(destinationId) {
    if (destinationId === -1) {
      this.openDialog();
    } else if (this.save(destinationId)) {
      this.navigateToNextStep();
    }
  }

  navigateToNextStep() {
    this.router.navigate(['../', this.requestService.getNextStep(this.currentStepPath)], { relativeTo: this.route });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      autoFocus: true,
      maxWidth: 400,
      data: {
        title: 'Other destination',
        description: 'What\'s the destination name?',
        inputs: [
          {
            id: 'destinationName',
            value: this.requestService.getProperty('destinationName'),
            placeHolder: 'Destination Name',
            validatorOrOpts: [Validators.required]
          }
        ],
        buttonsLabel: {
          ok: 'Save',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe(inputs => {
      if (inputs && inputs[0]) {
        this.requestService.setProperty('destination', -1);
        this.requestService.setProperty('destinationName', inputs[0].value);
        this.navigateToNextStep();
      }
    });
  }

}
